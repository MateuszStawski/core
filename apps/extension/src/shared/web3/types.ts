import { EIP1193Provider } from 'mipd';
import { Chain as ViemChain, Hex } from 'viem';

export type Chain = ViemChain & { logo: string };

export interface Token {
  name: string;
  logo: string;
  symbol: string;
}

export interface ChainToken extends Token {
  decimals: number;
  address: Hex;
}

export interface Wallet {
  provider: EIP1193Provider;
  account: Hex;
  chainId: number;
  providerRdns: string;
}
