import { useCallback } from 'react';
import { Hex, WalletClient } from 'viem';
import { getSafeNumber, isNativeTokenAddress } from '@idriss-xyz/utils';
import { CHAIN_ID_TO_TOKENS } from '@idriss-xyz/constants';

import { SendPayload } from '../schema';

import { useSwitchChain } from './use-switch-chain';
import { useGetTokenPerDollar } from './use-get-token-per-dollar';
import { useNativeTransaction } from './use-native-transaction';
import { useErc20Transaction } from './use-erc20-transaction';

type Properties = {
  walletClient?: WalletClient;
};

export const useSender = ({ walletClient }: Properties) => {
  const switchChain = useSwitchChain();

  const getTokenPerDollarMutation = useGetTokenPerDollar();
  const nativeTransaction = useNativeTransaction();
  const erc20Transaction = useErc20Transaction();

  const send = useCallback(
    async ({
      sendPayload,
      recipientAddress,
    }: {
      recipientAddress: Hex;
      sendPayload: SendPayload;
    }) => {
      if (!walletClient) {
        console.error('walletClient not defined');
        return;
      }

      const usdcToken = CHAIN_ID_TO_TOKENS[sendPayload.chainId]?.find(
        (token) => {
          return token.symbol === 'USDC';
        },
      );

      const tokenPerDollar = await getTokenPerDollarMutation.mutateAsync({
        chainId: sendPayload.chainId,
        amount: 10 ** (usdcToken?.decimals ?? 0),
        buyToken: sendPayload.tokenAddress,
        sellToken: usdcToken?.address ?? '',
      });
      const tokenPerDollarNormalised = Number(tokenPerDollar.price);

      const tokenToSend = CHAIN_ID_TO_TOKENS[sendPayload.chainId]?.find(
        (token) => {
          return token.address === sendPayload.tokenAddress;
        },
      );

      const { decimals, value } = getSafeNumber(
        tokenPerDollarNormalised * sendPayload.amount,
      );
      const valueAsBigNumber = BigInt(value.toString());

      const tokensToSend =
        (valueAsBigNumber * BigInt(10) ** BigInt(tokenToSend?.decimals ?? 0)) /
        BigInt(10) ** BigInt(decimals);

      await switchChain.mutateAsync({
        chainId: sendPayload.chainId,
        walletClient,
      });

      if (isNativeTokenAddress(sendPayload.tokenAddress)) {
        nativeTransaction.mutate({
          tokensToSend,
          recipientAddress,
          walletClient,
          chainId: sendPayload.chainId,
          message: sendPayload.message,
        });
      } else {
        erc20Transaction.mutate({
          recipientAddress,
          tokenAddress: sendPayload.tokenAddress,
          walletClient,
          tokensToSend,
          chainId: sendPayload.chainId,
          message: sendPayload.message,
        });
      }
    },
    [
      erc20Transaction,
      getTokenPerDollarMutation,
      nativeTransaction,
      switchChain,
      walletClient,
    ],
  );

  const isSending =
    switchChain.isPending ||
    nativeTransaction.isPending ||
    erc20Transaction.isPending ||
    getTokenPerDollarMutation.isPending;

  const isError =
    switchChain.isError ||
    getTokenPerDollarMutation.isError ||
    nativeTransaction.isError ||
    erc20Transaction.isError;

  const isSuccess = nativeTransaction.isSuccess || erc20Transaction.isSuccess;

  const data = nativeTransaction.data ?? erc20Transaction.data;

  const tokensToSend = nativeTransaction.isPending
    ? nativeTransaction.variables?.tokensToSend
    : erc20Transaction.isPending
      ? erc20Transaction.variables.tokensToSend
      : undefined;

  const isIdle = !isSending && !isError && !isSuccess;

  const reset = useCallback(() => {
    getTokenPerDollarMutation.reset();
    nativeTransaction.reset();
    erc20Transaction.reset();
    switchChain.reset();
  }, [
    erc20Transaction,
    getTokenPerDollarMutation,
    nativeTransaction,
    switchChain,
  ]);

  return {
    send,
    isSending,
    isError,
    isSuccess,
    isIdle,
    data,
    tokensToSend,
    reset,
  };
};
