# TreasuryVault — Web3 DevOps / Platform Engineering Demo

**TreasuryVault** is a minimal, production-style Ethereum smart contract project that demonstrates how I design, test, deploy, and verify blockchain infrastructure end-to-end using modern Web3 and DevOps practices.

This repository is intentionally **small but real** — it focuses on correctness, deployment safety, and verifiability rather than UI or demo-only patterns.

---

## What this project proves

- ✅ Smart contract design with **explicit access control** and **audit-friendly events**
- ✅ Deterministic local testing using **Hardhat v3 + viem + node:test**
- ✅ **Public deployment** to a real Ethereum network (Sepolia testnet)
- ✅ Post-deployment **on-chain verification** via read calls
- ✅ **Secret hygiene** (no private keys in repo; env-based configuration)
- ✅ Repeatable, script-driven deployments (infra mindset)

---

## Live deployment (public proof)

- **Network:** Ethereum Sepolia (testnet)
- **Contract:** TreasuryVault
- **Address:** `0xae4f7f083c94edac1c1af83b0f63d365ca6856fe`
- **Explorer:**  
  https://sepolia.etherscan.io/address/0xae4f7f083c94edac1c1af83b0f63d365ca6856fe

You can inspect:

- Contract bytecode
- Transactions
- ETH balance
- Owner address

---

## Contract overview

`TreasuryVault` is a simple ETH-holding contract with:

- Single owner (set at deploy time)
- Public ETH deposits (`receive`)
- Owner-only withdrawals
- Ownership transfer
- Explicit custom errors
- Event-based audit trail

This mirrors real treasury / custody / infra patterns rather than toy examples.

---

## Tech stack

- **Solidity** `0.8.x`
- **Hardhat v3** (modern build, network orchestration)
- **viem** (explicit, production-grade Ethereum client)
- **node:test** (CI-friendly test runner)
- **Alchemy** (Sepolia RPC provider)

---

## Run locally

```bash
npm install
npx hardhat test
```
