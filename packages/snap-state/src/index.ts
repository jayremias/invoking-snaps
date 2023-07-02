import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { SetStateParams } from './types';
import { clearState, getState, setState } from './utils';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  origin,
  request,
}) => {
  switch (request.method) {
    case 'setState': {
      const params = request.params as SetStateParams;
      const state = await getState();

      await setState({ ...state, ...params });
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(
              `State set to:${JSON.stringify(
                { ...state, ...params },
                null,
                2,
              )}`,
            ),
          ]),
        },
      });
    }

    case 'getState':
      return await getState();

    case 'clearState':
      await clearState();
      return true;

    default:
      throw new Error('Method not found.');
  }
};
