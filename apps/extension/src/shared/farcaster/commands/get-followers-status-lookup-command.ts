import { Hex } from 'viem';

import {
  Command,
  FailureResult,
  HandlerError,
  OkResult,
} from 'shared/messaging';

import { getFollowers } from '../api';

type Payload = Record<string, never>;
type Response = Record<string, { address: Hex; twitter: string }>;

export class GetFollowersCommand extends Command<Payload, Response> {
  public readonly name = 'GetFollowersCommand' as const;

  constructor(public payload: Payload) {
    super();
  }

  async handle() {
    try {
      const followers = await getFollowers();

      return new OkResult(followers);
    } catch (error) {
      this.captureException(error);
      if (error instanceof HandlerError) {
        return new FailureResult(error.message);
      }

      return new FailureResult();
    }
  }
}
