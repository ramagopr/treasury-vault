# TreasuryVault — End-to-End Step-by-Step Guide (Mac)

> Goal: Write, test, deploy, and verify a Solidity smart contract on Ethereum Sepolia using modern tooling and DevOps-style practices.

This guide assumes:

- macOS
- Comfortable with terminal & Git
- New or semi-new to Web3 is fine

---

## 0. Prerequisites (one time)

Install / verify:

```bash
node --version     # >= 20
npm --version
git --version


#Recommended tools:

#VS Code

#MetaMask (browser extension)

mkdir chainops
cd chainops

git init
npm init -y

npm install --save-dev hardhat
npx hardhat --init

Choose:

✔ TypeScript project

✔ node:test

✔ viem

✔ install dependencies

This creates:




contracts/
scripts/
test/
hardhat.config.ts



3. Write the smart contract

Create file:

code contracts/TreasuryVault.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error NotOwner();
error ZeroAddress();

contract TreasuryVault {
    address public owner;

    event Deposited(address indexed from, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    constructor(address _owner) {
        if (_owner == address(0)) revert ZeroAddress();
        owner = _owner;
    }

    receive() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(address to, uint256 amount) external {
        if (msg.sender != owner) revert NotOwner();
        if (to == address(0)) revert ZeroAddress();

        (bool ok, ) = to.call{value: amount}("");
        require(ok, "transfer failed");

        emit Withdrawn(to, amount);
    }

    function transferOwnership(address newOwner) external {
        if (msg.sender != owner) revert NotOwner();
        if (newOwner == address(0)) revert ZeroAddress();

        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

4. Write tests (node:test + viem)

Create test file:
code test/TreasuryVault.ts

import test from "node:test";
import assert from "node:assert/strict";
import { parseEther, zeroAddress } from "viem";
import { network } from "hardhat";

test("TreasuryVault: sets owner from constructor", async () => {
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();

  const vault = await viem.deployContract("TreasuryVault", [
    deployer.account.address,
  ]);

  const owner = await viem.readContract({
    address: vault.address,
    abi: vault.abi,
    functionName: "owner",
  });

  assert.equal(owner.toLowerCase(), deployer.account.address.toLowerCase());
});

test("TreasuryVault: accepts ETH deposits", async () => {
  const { viem } = await network.connect();
  const [deployer, user] = await viem.getWalletClients();

  const vault = await viem.deployContract("TreasuryVault", [
    deployer.account.address,
  ]);

  await user.sendTransaction({
    to: vault.address,
    value: parseEther("0.01"),
  });

  const bal = await viem.readContract({
    address: vault.address,
    abi: vault.abi,
    functionName: "balance",
  });

  assert.equal(bal, parseEther("0.01"));
});

test("TreasuryVault: only owner can withdraw", async () => {
  const { viem } = await network.connect();
  const [deployer, user] = await viem.getWalletClients();

  const vault = await viem.deployContract("TreasuryVault", [
    deployer.account.address,
  ]);

  await user.sendTransaction({
    to: vault.address,
    value: parseEther("0.02"),
  });

  await assert.rejects(
    viem.writeContract({
      address: vault.address,
      abi: vault.abi,
      functionName: "withdraw",
      args: [user.account.address, parseEther("0.01")],
      account: user.account,
    })
  );
});


Run tests:

npx hardhat test

✅ All tests must pass.

5. Wallet & Sepolia setup
MetaMask

Install MetaMask

Switch network to Sepolia

Copy wallet address

Export private key (keep secret)

RPC provider

Create account at https://www.alchemy.com

Create a Sepolia app

Copy HTTPS RPC URL


6. Environment variables

Install dotenv:

npm install -D dotenv


Create .env:

code .env


Add:

SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/XXXX
SEPOLIA_PRIVATE_KEY=64_hex_char_private_key_without_0x

7. Fund wallet

Use a faucet:

https://sepoliafaucet.com

Paste your wallet address and wait ~1 minute.

8. Deployment script

Create:

code scripts/deploy-sepolia.ts


Paste:

import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();

  console.log("Deployer:", deployer.account.address);

  const vault = await viem.deployContract("TreasuryVault", [
    deployer.account.address,
  ]);

  console.log("TreasuryVault deployed to:", vault.address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


Deploy:

node -r dotenv/config ./node_modules/.bin/hardhat run scripts/deploy-sepolia.ts --network sepolia


Save the deployed contract address.

9. Read on-chain state (proof)

Create:

code scripts/read-owner.ts


Paste:

import { network } from "hardhat";

const ADDR = "DEPLOYED_CONTRACT_ADDRESS";

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

main();
Run:

node -r dotenv/config ./node_modules/.bin/hardhat run scripts/read-owner.ts --network sepolia

10. Push to GitHub
git add .
git commit -m "TreasuryVault: tests + Sepolia deployment"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main

Final result checklist

✅ Solidity contract written

✅ Tests passing

✅ Sepolia deployment

✅ Etherscan-visible address

✅ GitHub repo with README

✅ Reproducible setup


One-line summary

This project demonstrates writing, testing, deploying, and verifying a real Ethereum smart contract using production-grade tooling and DevOps principles.
```
