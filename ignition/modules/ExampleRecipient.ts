// MetaTxModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MetaTxModule", (m) => {
  const forwarder = m.contract("Forwarder");
  const recipient = m.contract("ExampleRecipient", [forwarder]);

  // Keep the call (this will still execute during deployment)
  m.call(recipient, "isTrustedForwarder", [forwarder]);

  return {
    forwarder,
    recipient,
  };
});