# Architecture

## Constant-product pool

The pool maintains reserves R0 and R1 and quotes exact-input swaps using the constant-product formula with a 30 bps fee:

amountInWithFee = amountIn × 9,970  
amountOut = amountInWithFee × reserveOut / (reserveIn × 10,000 + amountInWithFee)

LP shares are minted from the geometric mean at initial liquidity and proportionally thereafter. Removal burns LP shares and returns proportional reserves. Integer arithmetic is used throughout.

## Lending vault

Borrower positions store collateral and debt balances. The vault values each asset using a mock oracle price scaled to 1e8 and assumes 18-decimal ERC-20 amounts. Borrowing and withdrawals are constrained by 60% loan-to-value. If the debt value exceeds the collateral value multiplied by the LTV, a liquidator may repay debt and receive collateral plus a 5% bonus.

This is a simplified teaching model: no interest, oracle heartbeat, staleness guard, liquidation close factor or auction.

## Event ingestion

The Express service validates event envelope fields, deduplicates by transaction hash/event/block and exposes chain-filtered records. It does not connect to a blockchain node. Production indexing must decode verified logs from trusted RPC sources, check confirmations/finality, persist cursors, recover from reorganisations and enforce access controls.

## Security controls

OpenZeppelin SafeERC20, ReentrancyGuard and Ownable are used where appropriate. The code remains unaudited and is not suitable for production funds.
