require('dotenv').config();

console.log(
  'env ok:',
  Boolean(process.env.SEPOLIA_RPC_URL),
  Boolean(process.env.SEPOLIA_PRIVATE_KEY),
);

console.log(
  'pk length:',
  process.env.SEPOLIA_PRIVATE_KEY ? process.env.SEPOLIA_PRIVATE_KEY.length : 0,
);
