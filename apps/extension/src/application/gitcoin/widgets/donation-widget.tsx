import { useCallback, useState } from 'react';
import { Button } from '@idriss-xyz/ui/button';
import { roundToSignificantFigures } from '@idriss-xyz/utils';
import { EMPTY_HEX } from '@idriss-xyz/constants';
import { formatEther } from 'viem';

import { useWallet } from 'shared/extension';
import { IdrissSend } from 'shared/idriss';
import { ethToDollars, GetTokenPriceCommand, TOKEN } from 'shared/web3';
import { ErrorMessage, GasIcon, Spinner } from 'shared/ui';
import { useCommandQuery } from 'shared/messaging';

import { DonationPayload, WidgetData } from '../types';
import {
  GET_ETH_PER_DOLLAR_COMMAND_DETAILS,
  GITCOIN_ICON,
  MIN_CROSS_CHAIN_DONATION_AMOUNT,
} from '../constants';
import { getLoadingMessage } from '../utils';
import { SomethingWentWrongMessage } from '../components';
import { useDonationForm, useDonationMaker, useFees } from '../hooks';

type Properties = {
  widgetData: WidgetData;
};

export const DonationWidget = ({ widgetData }: Properties) => {
  const [isOpened, setIsOpened] = useState(false);
  const { isConnectionModalOpened, openConnectionModal } = useWallet();

  const handleOpen = useCallback(() => {
    setIsOpened(true);
  }, []);

  const getEthPerDollarQuery = useCommandQuery({
    command: new GetTokenPriceCommand(GET_ETH_PER_DOLLAR_COMMAND_DETAILS),
    refetchInterval: 60_000,
    select: (v) => {
      return Number(v.price);
    },
    retry: 0,
    enabled: isOpened,
  });

  const ethPerDollar = getEthPerDollarQuery.data ?? 0;

  const { node, username, isHandleUser, application } = widgetData;

  const { wallet } = useWallet();

  const {
    amount,
    userAmountInWei,
    onChangeChainId,
    formMethods,
    isCrossChain,
    debouncedAmount,
    chainId,
    chainIdOptions,
  } = useDonationForm({
    application,
    ethPerDollar,
  });

  const feesQuery = useFees({
    application,
    amountInWei: userAmountInWei,
    enabled: debouncedAmount >= MIN_CROSS_CHAIN_DONATION_AMOUNT,
  });

  const getChainFeeInDollars = useCallback(
    (chainId: number) => {
      if (!feesQuery.data) {
        return 0;
      }

      const feeInWei = feesQuery.data[chainId]?.totalRelayFee.total
        ? Number(feesQuery.data[chainId]?.totalRelayFee.total)
        : 0;
      const feeInEth = Number(formatEther(BigInt(feeInWei)));

      return ethToDollars(feeInEth, ethPerDollar);
    },
    [ethPerDollar, feesQuery.data],
  );

  const donationMaker = useDonationMaker({ wallet });

  const submit = useCallback(
    async (data: DonationPayload) => {
      await donationMaker.donate({
        application,
        options: data,
        ethPerDollar,
      });
    },
    [application, donationMaker, ethPerDollar],
  );

  const renderChainSuffix = useCallback(
    (renderedChainId: number) => {
      if (renderedChainId === application.chainId) {
        return null;
      }

      if (feesQuery.isLoading) {
        return (
          <div className="flex w-full items-center justify-end">
            <Spinner className="size-2" />
          </div>
        );
      }

      const feeInDollars = getChainFeeInDollars(renderedChainId);
      return (
        <>
          {feeInDollars > 0 ? (
            <p className="flex w-full items-center justify-end space-x-1 text-xs text-[#64748B]">
              <span>{`$${feeInDollars}`}</span>
              <span>+</span>
              <GasIcon />
            </p>
          ) : null}
        </>
      );
    },
    [application.chainId, feesQuery.isLoading, getChainFeeInDollars],
  );

  const iconSize = isHandleUser ? 22 : 16;
  const iconSource = GITCOIN_ICON;

  const reset = useCallback(() => {
    formMethods.reset();
    donationMaker.reset();
  }, [donationMaker, formMethods]);

  const handleClose = useCallback(() => {
    setIsOpened(false);
    reset();
  }, [reset]);

  return (
    <IdrissSend.Container
      node={node}
      iconSrc={iconSource}
      iconSize={iconSize}
      recipientName={username}
      closeOnClickAway={donationMaker.isIdle}
      onClose={handleClose}
      onOpen={handleOpen}
      header={<IdrissSend.Heading>Donate to @{username}</IdrissSend.Heading>}
    >
      {({ close }) => {
        if (donationMaker.isDonating) {
          return (
            <IdrissSend.Loading
              className="px-5 pb-9 pt-5"
              heading={
                <>
                  Sending <span className="text-mint-600">${amount}</span> (
                  {roundToSignificantFigures(userAmountInWei / 10 ** 18, 2)}{' '}
                  ETH)
                </>
              }
              recipient={username}
            >
              {getLoadingMessage(isCrossChain)}
            </IdrissSend.Loading>
          );
        }

        if (donationMaker.isSuccess) {
          return (
            <IdrissSend.Success
              className="p-5"
              onConfirm={close}
              chainId={chainId}
              transactionHash={donationMaker.data?.transactionHash ?? EMPTY_HEX}
            />
          );
        }

        return (
          <>
            <IdrissSend.Form
              formMethods={formMethods}
              tokens={[{ ...TOKEN.ETHEREUM, decimals: 18, address: '0x0' }]}
              onSubmit={submit}
              allowedChainsIds={chainIdOptions}
              renderChainSuffix={renderChainSuffix}
              onChangeChainId={onChangeChainId}
              footer={
                <>
                  {wallet ? (
                    <Button
                      intent="primary"
                      size="medium"
                      type="submit"
                      className="w-full"
                      loading={feesQuery.isLoading}
                      disabled={feesQuery.isError}
                    >
                      Donate
                    </Button>
                  ) : (
                    <Button
                      intent="primary"
                      size="medium"
                      className="w-full"
                      onClick={openConnectionModal}
                      loading={isConnectionModalOpened}
                    >
                      Log In
                    </Button>
                  )}
                  {feesQuery.isError ? (
                    <SomethingWentWrongMessage onRetry={feesQuery.refetch} />
                  ) : null}
                  {donationMaker.isError ? (
                    <ErrorMessage className="mt-4">
                      Something went wrong.
                    </ErrorMessage>
                  ) : null}
                </>
              }
            />
          </>
        );
      }}
    </IdrissSend.Container>
  );
};
