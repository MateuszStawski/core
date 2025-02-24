import { Outlet } from 'react-router';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { useMemo } from 'react';
import { Badge } from '@idriss-xyz/ui/badge';
import { Wallet } from '@idriss-xyz/wallet-connect';

import { POPUP_ROUTE, useExtensionPopup, useWallet } from 'shared/extension';
import { useSubscriptions } from 'application/trading-copilot';

import { POPUP_ROUTE_TITLE } from '../constants';

type UserStatusBadgeProperties = {
  wallet: Wallet;
};

const IconPlaceholder = () => {
  return <div className="size-11" />;
};

export const TradingCopilotLayout = () => {
  const popup = useExtensionPopup();
  const title = POPUP_ROUTE_TITLE[popup.currentRoute];
  const { wallet } = useWallet();

  const leftColumn = useMemo(() => {
    const allowToNavigateBack =
      popup.currentRoute === POPUP_ROUTE.TRADING_COPILOT;
    return allowToNavigateBack ? (
      <IconButton
        intent="tertiary"
        size="medium"
        iconName="ArrowLeft"
        onClick={popup.navigateBack}
      />
    ) : (
      <IconPlaceholder />
    );
  }, [popup.currentRoute, popup.navigateBack]);

  return (
    <div className="flex h-full flex-col bg-white px-4 pb-3 pr-0 pt-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        {leftColumn}

        <span className="flex items-center justify-center gap-x-2">
          <h1 className="text-heading4 text-neutral-900">{title}</h1>
          {wallet ? <UserStatusBadge wallet={wallet} /> : null}
        </span>

        <IconPlaceholder />
      </div>
      <Outlet />
    </div>
  );
};

const UserStatusBadge = ({ wallet }: UserStatusBadgeProperties) => {
  const { isPremiumUser } = useSubscriptions({ wallet });

  if (!isPremiumUser) {
    return;
  }

  return (
    <Badge type="success" variant="subtle">
      Premium
    </Badge>
  );
};
