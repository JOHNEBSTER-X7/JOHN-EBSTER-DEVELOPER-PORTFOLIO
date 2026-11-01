# Interview Walkthrough Guide

## 1. What problem does it solve?

It prevents a single key holder from unilaterally authorising a transfer. Three of the five configured owners must approve a proposal.

## 2. How is the threshold enforced?

Each transaction stores an approval count. A mapping records whether each owner has confirmed a given transaction. Duplicate confirmations are rejected, so one owner cannot inflate the threshold.

## 3. Why is the proposer auto-confirmed?

Submitting a proposal is treated as the proposer's first approval. This is explicit in the submit function and emits the same confirmation event as subsequent approvals.

## 4. Why mark a transaction executed before making an external call?

The checks-effects-interactions pattern prevents a recipient contract from re-entering while the same transaction still appears executable. The guard adds another layer around execution.

## 5. What happens if the external call fails?

The require statement reverts the whole transaction, including the earlier state update, leaving the proposal unexecuted.

## 6. What would you improve for production?

Independent audit, fuzz and invariant testing, owner rotation and recovery design, token support, timelocks, clearer operational UX, monitoring, explicit transaction expiry and carefully modelled emergency procedures.
