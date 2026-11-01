# Architecture

## Domain modules
The Treasury service owns seeded currency positions, forecast cash flows, static GBP conversion rates, counterparty limits and transaction workflow state.

## Liquidity forecast
Dated cash flows are sorted chronologically and applied to opening currency positions to calculate projected closing balances. The prototype forecast is not probability-weighted and does not model intraday liquidity.

## FX exposure and stress
Each currency position is translated into GBP using a fixed illustrative conversion rate. Stress scenarios apply percentage shocks independently to each currency and aggregate GBP impacts. No correlation, volatility, VaR or hedge effectiveness model is claimed.

## Maker-checker transaction workflow
Outflows reserve available balance when proposed. An independent reviewer approves or rejects. Rejection releases the reservation; completion is allowed only after approval and updates the simulated ledger balance.

## Production evolution
Add authenticated identity and entitlements, separation-of-duties policy, persistent transactional database, immutable audit log, bank statement feeds, live FX market data, forward/derivative positions, intraday cash forecasting, collateral and counterparty netting, model governance and independent risk validation.
