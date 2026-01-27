import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();

  console.log("Deployer:", deployer.account.address);

  const vault = await viem.deployContract("TreasuryVault", [deployer.account.address]);

  console.log("TreasuryVault deployed to:", vault.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
