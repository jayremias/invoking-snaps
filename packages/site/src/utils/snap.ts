import { defaultEncryptSnapOrigin } from '../config';
import { defaultStateSnapOrigin } from '../config/snap';
import { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultEncryptSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param snapId - The ID of the snap to install.
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (
  snapId?: string,
  version?: string,
): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) => snap.id === snapId && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Generate state for the snap.
 *
 * @param state - The state to generate.
 */

export const generateState = async (state: unknown) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultStateSnapOrigin,
      request: {
        method: 'setState',
        params: state,
      },
    },
  });
};

/**
 * Clear the state for the snap.
 *
 */

export const getState = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultEncryptSnapOrigin,
      request: { method: 'invoke_snap' },
    },
  });
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
