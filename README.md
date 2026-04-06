# Sponsored Transactions on Rootstock

Update the values in `.env` with your own values

---

To deploy contracts, run:
```bash
npx hardhat ignition deploy ignition/modules/ExampleRecipient.ts --network rootstockTestnet
```

To start the relayer:
```bash
cd relayer && node server.ts
```

To start the frontend, run:
```bash
cd frontend && npx serve .
```