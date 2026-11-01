# Architecture

## On-chain components

- PermissionedAssetToken inherits OpenZeppelin ERC20, AccessControl and Pausable. Compliance role manages allowlist membership; admin mints only to allowlisted wallets. Transfers require both parties to be allowlisted.
- AssetRegistry stores descriptive metadata references and issuer attribution. It does not verify ownership/title or off-chain documents.
- DistributionManager holds native currency sent to a distribution and pays fixed, manager-assigned claims. ReentrancyGuard protects claim execution.

## Off-chain event ingestion

The Express indexer validates a narrow event schema, deduplicates by transaction hash, event name and block number, and returns stored events. A production indexer must independently fetch logs from trusted RPC endpoints, verify contract addresses and event signatures, track confirmations/finality, recover from chain reorganisations, persist checkpoints and use a durable database.

## Security boundaries

Roles are administered by a single deployer in the demo. Production should use multisig governance, timelocks, least privilege, key rotation, emergency procedures, independent audit, monitoring and incident response. Allowlisting is not equivalent to KYC or regulatory approval.
