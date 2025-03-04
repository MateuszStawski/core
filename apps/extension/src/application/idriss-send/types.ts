import { Hex } from 'viem';

import { IconType } from './schema';

export interface WidgetData {
  top: number;
  username: string;
  availableNetworks?: number[];
  widgetOverrides?: {
    headerCopy: string;
    sendButtonCopy: string;
    iconType: IconType;
  };
  walletAddress: Hex;
  node: HTMLElement;
  nodeId: string;
  isHandleUser: boolean;
  type: 'idrissSend';
}
