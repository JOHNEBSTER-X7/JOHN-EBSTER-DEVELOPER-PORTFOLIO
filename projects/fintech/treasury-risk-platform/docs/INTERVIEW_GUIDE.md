# Interview guide

## How is the cash forecast calculated?
The service applies dated inflows and outflows in date order to each currency's opening balance and returns closing projections.

## How is foreign exchange risk represented?
Currency balances are converted to GBP at explicitly illustrative fixed rates. Stress tests apply user-supplied percentage shocks and show the translated impact.

## What is maker-checker control?
A transaction is proposed by an account, then a different reviewer ID must approve or reject it. An approved transaction can then be completed. A rejected outflow releases its reserved available balance.

## What are the key production gaps?
Secure identity and authorization, durable transactional storage, audit immutability, real bank/FX integrations, reconciliation, intraday forecasting, validated risk models, operational controls and regulatory requirements.
