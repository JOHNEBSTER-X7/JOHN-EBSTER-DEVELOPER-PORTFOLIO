# Three-of-Five Multisignature Wallet

A Solidity learning project that models a wallet controlled by five distinct owners, with three confirmations required before a proposed transaction can execute.

## Intended functionality

- Fixed set of five unique, non-zero owners
- Transaction proposal by an owner
- Owner confirmation and confirmation revocation
- Execution only after the threshold is reached
- Protection against repeated execution and re-entrant execution
- Native-asset transfer demonstration

## Important limitations

This is an educational prototype, not an audited wallet. Do not deploy it to manage real funds. A production multisig requires independent security review, careful threat modelling, robust operational procedures, key-management controls, deployment verification and monitoring.

## Project files

The planned implementation uses Hardhat:

- `contracts/ThreeOfFiveWallet.sol`
- `test/ThreeOfFiveWallet.test.js`
- `hardhat.config.js`
- `package.json`

These implementation files will be added only after their exact source has been reviewed and checked into this repository. The test status is therefore **not yet verified in this repository**.

## Suggested local checks

After the implementation and dependencies are present:

```bash
npm install
npx hardhat compile
npx hardhat test
```

Record the Node.js version and command output when reporting test results.
