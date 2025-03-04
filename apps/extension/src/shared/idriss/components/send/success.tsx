import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';
import { Link } from '@idriss-xyz/ui/link';
import { classes } from '@idriss-xyz/ui/utils';
import { Hex } from 'viem';
import { getTransactionUrl } from '@idriss-xyz/utils';

interface Properties {
  chainId: number;
  transactionHash: Hex;
  onConfirm: () => void;
  className?: string;
  heading?: string;
}

export const Success = ({
  chainId,
  transactionHash,
  onConfirm,
  className,
  heading,
}: Properties) => {
  const transactionUrl = getTransactionUrl({ chainId, transactionHash });
  return (
    <div
      className={classes('flex flex-col items-center text-center', className)}
    >
      <div className="rounded-[100%] bg-mint-200 p-4">
        <Icon
          name="CheckCircle2"
          className="stroke-1 text-mint-600"
          size={48}
        />
      </div>
      <p className="text-heading4 text-neutral-900">
        {heading ?? 'Transfer completed'}
      </p>
      <Link
        size="medium"
        href={transactionUrl}
        className="mt-2 flex items-center"
        isExternal
      >
        View on explorer
      </Link>
      <Button
        className="mt-6 w-full uppercase"
        intent="negative"
        size="medium"
        onClick={onConfirm}
      >
        Close
      </Button>
    </div>
  );
};
