import { createPublicClient, Hex, http } from 'viem';
import { mainnet } from 'viem/chains';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

type Payload = {
  address: Hex;
};

type Response = string | null;

export class GetEnsNameCommand extends Command<Payload, Response> {
  public readonly name = 'GetEnsNameCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const client = createPublicClient({
        chain: { ...mainnet },
        transport: http('https://eth.llamarpc.com'),
      });
      const result = await client.getEnsName(this.payload);

      return new OkResult(result);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
