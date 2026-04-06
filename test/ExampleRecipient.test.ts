import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";
import { encodeFunctionData } from "viem"; // ✅ FIX

describe("ExampleRecipient with MinimalForwarder", async function () {
  const { viem } = await network.connect();

  let forwarder: any;
  let recipient: any;
  let deployer: any, user: any, relayer: any;

  beforeEach(async function () {
    const wallets = await viem.getWalletClients();
    [deployer, user, relayer] = wallets;

    forwarder = await viem.deployContract("Forwarder");

    recipient = await viem.deployContract("ExampleRecipient", [
      forwarder.address,
    ]);
  });

  it("should trust the forwarder", async function () {
    const isTrusted = await recipient.read.isTrustedForwarder([
      forwarder.address,
    ]);

    assert.equal(isTrusted, true);
  });

  it("should increment counter via meta-transaction", async function () {
    const publicClient = await viem.getPublicClient();

    // ✅ Correct encoding
    const data = encodeFunctionData({
      abi: recipient.abi,
      functionName: "incrementCounter",
      args: [],
    });

    const nonce = await forwarder.read.getNonce([
      user.account.address,
    ]);

    const chainId = await publicClient.getChainId();

    const request = {
      from: user.account.address,
      to: recipient.address,
      value: 0n,
      gas: 100000n,
      nonce: nonce,
      data: data,
    };

    const domain = {
      name: "MinimalForwarder",
      version: "0.0.1",
      chainId: chainId,
      verifyingContract: forwarder.address,
    };

    const types = {
      ForwardRequest: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "gas", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "data", type: "bytes" },
      ],
    };

    const signature = await user.signTypedData({
      domain,
      types,
      primaryType: "ForwardRequest",
      message: request,
    });

    await forwarder.write.execute([request, signature], {
      account: relayer.account,
    });

    const counter = await recipient.read.getCounter([
      user.account.address,
    ]);

    assert.equal(counter, 1n);
  });
});