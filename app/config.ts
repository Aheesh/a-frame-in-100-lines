// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://blpframe.vercel.app';
export const PLAYER_A_CONTRACT_ADDR = '';
export const STABLE_CONTRACT_ADDR = '';
export const BAL_VAULT_ADDR = '0xba12222222228d8ba445958a75a0704d566bf2c8';
export const PLAYER_A_ADDR = '0xaA4eC2d86E61632E88Db93cf6D2a42E5f458DC99';
export const PLAYER_B_ADDR = '0xe96891F2d3838Bfbbce1285e0913b195acc935c5';
export const DRAW_ADDR = '0x62A52757b580e7FD97203bD0408a7445741b5D5f';
export const DEGEN_ADDR = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed';
export const POOL_ID = '0xc8503e1a4e439800dea3424cbfc085cbeb6c3bfe000100000000000000000172';
