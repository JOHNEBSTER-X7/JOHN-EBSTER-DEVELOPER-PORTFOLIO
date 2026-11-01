# Interview guide

## Why permissioned transfers?
Some asset distribution models require transfers to be restricted to approved wallets. This contract demonstrates a simple allowlist gate, not a legally sufficient transfer-control framework.

## How are roles separated?
The compliance role controls investor allowlisting while the default administrator controls minting and pause actions. Production governance should separate these authorities further and protect them with multisig and timelocks.

## What does the registry prove?
Only that an authorised manager wrote descriptive metadata and issuer information to this contract. It does not prove the issuer owns the asset or that token holders have enforceable rights.

## How does distribution work?
A manager funds a distribution, assigns fixed amounts to wallets, and each wallet claims once. It is deliberately not a yield or dividend calculator.

## What would production require?
Independent contract audit, legal structuring, verified asset custody/title, investor eligibility controls, sanctions/AML processes, secure governance, reliable RPC indexing, reorganisation handling, durable storage, monitoring and tested incident response.
