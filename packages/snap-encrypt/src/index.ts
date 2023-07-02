import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';

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
    case 'invoke_snap': {
      // Get the state from the other snap
      const state = await snap.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'local:localhost:9090',
          request: {
            method: 'getState',
          },
        },
      });

      // TODO: This is where we would encrypt the state
      console.log('state', state);

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Other snap state:${JSON.stringify(state, null, 2)}`),
          ]),
        },
      });
    }
    default:
      throw new Error('Method not found.');
  }
};
