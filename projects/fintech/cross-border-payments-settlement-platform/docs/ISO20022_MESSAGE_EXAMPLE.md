# Payment message examples

## ISO 20022-style pacs.008

The API generates a small XML illustration using the `pacs.008.001.08` namespace. It includes a message identifier, creation timestamp, end-to-end identifier, settlement amount/currency and creditor name/account reference.

The example is intentionally incomplete. It omits many mandatory or profile-specific elements that real payment infrastructures may require, including full instructing/instructed agent structures, settlement method, charge bearer, debtor and creditor agent details, regulatory reporting, remittance information, purpose codes, clearing system data and schema/profile validation.

## SWIFT MT103-style simulation

Selecting `swift_simulation` returns a text illustration containing familiar field labels such as `:20:`, `:32A:`, `:59:` and `:70:`. It is not a complete MT103 message, does not follow a validated FIN network profile and cannot be submitted to SWIFT.

## Important distinction

ISO 20022 is a financial messaging standard, not a payment rail by itself. SWIFT is a financial messaging network, not the settlement of funds. This portfolio project only renders illustrative message text and models state transitions locally; it has no SWIFT or ISO network connection.
