import { network } from "hardhat";

const ADDR = "0xae4f7f083c94edac1c1af83b0f63d365ca6856fe";

async function main() {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  const owner = await publicClient.readContract({
    address: ADDR,
    abi: (await viem.getContractAt("TreasuryVault", ADDR)).abi,
    functionName: "owner",
  });

  console.log("owner:", owner);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
