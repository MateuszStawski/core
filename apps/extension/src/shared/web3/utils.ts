import {
  createWalletClient as createViemWalletClient,
  custom,
  getAddress,
  publicActions,
} from 'viem';
import { IdrissCrypto } from 'idriss-crypto/lib/browser';

import { Hex, Wallet } from './types';
import { CHAIN, NATIVE_COIN_ADDRESS } from './constants';

export const resolveAddress = async (address: string) => {
  const idriss = new IdrissCrypto();
  const idrissResolved: string = await idriss.reverseResolve(address);
  if (idrissResolved.length > 0) {
    return idrissResolved;
  }

  return;
};

export const createWalletClient = (
  wallet: Pick<Wallet, 'account' | 'provider'>,
) => {
  return createViemWalletClient({
    transport: custom(wallet.provider),
    account: wallet.account,
  }).extend(publicActions);
};

export const toAddressWithValidChecksum = (address: Hex) => {
  return getAddress(address);
};

const ethToWei = (amount: number) => {
  return amount * 10 ** 18;
};

export const weiToEth = (amount: number) => {
  return amount / 10 ** 18;
};

export const dollarToWei = (amount: number, ethPerDollar: number) => {
  return Math.floor(ethToWei(ethPerDollar * amount));
};

const ethToRawDollars = (amount: number, ethPerDollar: number) => {
  return amount / ethPerDollar;
};

export const ethToDollars = (amount: number, ethPerDollar: number) => {
  return Number(ethToRawDollars(amount, ethPerDollar).toFixed(2));
};

export const formatBigNumber = (number: number | string): string => {
  if (Number(number) < 1000) {
    return number.toString();
  }
  return number.toLocaleString('en-US', {
    minimumFractionDigits: Number(number) % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
};

function extractSignificantNumber(number: string) {
  const decimal = number.split('.')[1] ?? '';

  const significantPart = decimal.replace(/0+$/, '');
  const leadingZeros = /^0+/.exec(significantPart)?.[0] ?? '';

  if (!leadingZeros || leadingZeros.length < 3) {
    return { value: number, zeros: 0 };
  }

  const firstNonZero = /[1-9]/.exec(significantPart);
  const numberPart = significantPart.slice(firstNonZero?.index) ?? 0;

  return {
    value: Math.round(Number(numberPart.slice(0, 2))),
    zeros: leadingZeros.length - 1,
  };
}

export const roundToSignificantFiguresForCopilotTrading = (
  number: number,
  significantFigures: number,
): { value: number | string; index: number | null } => {
  if (number === 0) {
    return {
      value: 0,
      index: null,
    };
  }

  if (number >= 1_000_000_000) {
    return {
      value: `${(number / 1_000_000_000).toFixed(significantFigures)}B`,
      index: null,
    };
  }
  if (number >= 1_000_000) {
    return {
      value: `${(number / 1_000_000).toFixed(significantFigures)}M`,
      index: null,
    };
  }
  if (number >= 1000) {
    return {
      value: `${(number / 1000).toFixed(significantFigures)}K`,
      index: null,
    };
  }

  if (number.toString().includes('e')) {
    const scienceNumberArray = number.toString().split('e-');
    const decimals = scienceNumberArray?.[1] ?? '2';
    const startingDecimals =
      scienceNumberArray?.[0]?.split('.')?.[1]?.length ?? 0;
    const { value: significantNumber, zeros: indexZeros } =
      extractSignificantNumber(
        Number(number).toFixed(Number(decimals) + Number(startingDecimals)),
      ) || {};

    return {
      value: significantNumber,
      index: indexZeros,
    };
  }

  const { value, zeros } = extractSignificantNumber(number.toString());

  if (zeros >= 2 && number < 1) {
    return {
      value,
      index: zeros,
    };
  }

  const offset = 0.000_000_001;
  const multiplier = Math.pow(10, significantFigures);
  const rounded_number =
    Math.round((number + offset) * multiplier) / multiplier;

  return {
    value: rounded_number,
    index: null,
  };
};

export const roundToSignificantFigures = (
  number: number,
  significantFigures: number,
): number | string => {
  if (number === 0) {
    return 0;
  }

  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(significantFigures)}B`;
  }
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(significantFigures)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(significantFigures)}K`;
  }

  const multiplier = Math.pow(
    10,
    significantFigures - Math.floor(Math.log10(Math.abs(number))) - 1,
  );

  return Math.round(number * multiplier) / multiplier;
};

export const getWholeNumber = (number: string): number | string => {
  if (number?.includes('e')) {
    const scienceNumberArray = number.toString().split('e-');
    const decimals = scienceNumberArray?.[1] ?? '2';
    const startingDecimals =
      scienceNumberArray?.[0]?.split('.')?.[1]?.length ?? 0;
    return Number(number).toFixed(Number(decimals) + Number(startingDecimals));
  }
  return Number(number);
};

export const applyDecimalsToNumericString = (
  numericString: string,
  decimals: number,
): string => {
  // Check if the number string is valid
  if (!/^\d+$/.test(numericString)) {
    throw new Error('Invalid number string');
  }

  // If decimals is 0, return the number string as is
  if (decimals === 0) {
    return numericString;
  }

  // Calculate the position to insert the decimal point
  const length_ = numericString.length;
  const decimalPos = length_ - decimals;

  // If the position is less than or equal to 0, we need to pad with zeros at the start
  if (decimalPos <= 0) {
    return '0.' + '0'.repeat(Math.abs(decimalPos)) + numericString;
  }

  // Otherwise, insert the decimal point at the calculated position
  return (
    numericString.slice(0, decimalPos) + '.' + numericString.slice(decimalPos)
  );
};

export const isNativeTokenAddress = (tokenAddress: Hex) => {
  return tokenAddress === NATIVE_COIN_ADDRESS;
};

export const getChainById = (chainId: number) => {
  return Object.values(CHAIN).find((chain) => {
    return chain.id === chainId;
  });
};

const getBlockExplorer = (chainId: number) => {
  const chain = getChainById(chainId);
  return chain?.blockExplorers.default;
};

export const getBlockExplorerUrl = (chainId: number) => {
  return getBlockExplorer(chainId)?.url;
};

export const getTransactionUrl = (properties: {
  chainId: number;
  transactionHash: Hex;
}) => {
  const { chainId, transactionHash } = properties;
  const baseUrl = getBlockExplorerUrl(chainId);
  if (!baseUrl) {
    return '#';
  }
  return `${baseUrl}/tx/${transactionHash}`;
};

export const getRpcUrl = (chainId: number) => {
  const chain = getChainById(chainId);
  return chain?.rpcUrls.default.http[0] ?? '#';
};

export const isUnrecognizedChainError = (error: unknown) => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 4902
  );
};
