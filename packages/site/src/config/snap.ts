/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
export const defaultEncryptSnapOrigin =
  process.env.SNAP_ENCRYPT_ORIGIN ?? `local:http://localhost:8080`;
export const defaultStateSnapOrigin =
  process.env.SNAP_STATE_ORIGIN ?? `local:http://localhost:9090`;
