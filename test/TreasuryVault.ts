import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEther, zeroAddress } from 'viem';
import { network } from 'hardhat';

async function setup() {
  const { viem } = await network.connect();

  const publicClient = await viem.getPublicClient();
  const [deployer, user] = await viem.getWalletClients();

  const vault = await viem.deployContract('TreasuryVault', [deployer.account.address]);

  return { publicClient, deployer, user, vault };
}

test('TreasuryVault: sets owner from constructor', async () => {
  const { publicClient, deployer, vault } = await setup();

  const owner = await publicClient.readContract({
    address: vault.address,
    abi: vault.abi,
    functionName: 'owner',
  });

  assert.equal(owner.toLowerCase(), deployer.account.address.toLowerCase());
});

test('TreasuryVault: accepts ETH deposits', async () => {
  const { publicClient, user, vault } = await setup();

  await user.sendTransaction({
    to: vault.address,
    value: parseEther('0.01'),
  });

  const bal = await publicClient.readContract({
    address: vault.address,
    abi: vault.abi,
    functionName: 'balance',
  });

  assert.equal(bal, parseEther('0.01'));
});

test('TreasuryVault: only owner can withdraw', async () => {
  const { publicClient, deployer, user, vault } = await setup();

  await user.sendTransaction({
    to: vault.address,
    value: parseEther('0.02'),
  });

  // Non-owner withdraw should revert
  await assert.rejects(
    user.writeContract({
      address: vault.address,
      abi: vault.abi,
      functionName: 'withdraw',
      args: [user.account.address, parseEther('0.01')],
    }),
  );

  // Owner withdraw should succeed
  await deployer.writeContract({
    address: vault.address,
    abi: vault.abi,
    functionName: 'withdraw',
    args: [user.account.address, parseEther('0.01')],
  });

  const balAfter = await publicClient.readContract({
    address: vault.address,
    abi: vault.abi,
    functionName: 'balance',
  });

  assert.equal(balAfter, parseEther('0.01'));
});

test('TreasuryVault: transferOwnership rejects zero address', async () => {
  const { deployer, vault } = await setup();

  await assert.rejects(
    deployer.writeContract({
      address: vault.address,
      abi: vault.abi,
      functionName: 'transferOwnership',
      args: [zeroAddress],
    }),
  );
});
