/**
 * Returns the short name of the wallet address
 */
export const getShortWalletHex = (wallet: string) => {
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
};
