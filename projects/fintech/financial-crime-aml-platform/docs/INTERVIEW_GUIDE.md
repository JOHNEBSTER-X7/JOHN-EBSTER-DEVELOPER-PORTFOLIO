# Interview guide

## How does the monitoring engine work?
It applies transparent rules to transaction value, direction, jurisdiction and customer risk. Triggered rules contribute to a score and severity.

## How are potential sanctions matches reviewed?
The synthetic screening service creates a potential match. An independent reviewer can clear it or confirm it. A confirmed match raises the customer's risk band.

## How does case management work?
An alert becomes a case, which can be assigned to an analyst, annotated and closed with a disposition. A report draft is available only for a closed suspicious-activity or sanctions case.

## What are the limitations?
The watchlist is tiny and synthetic, scores are not validated, there is no live monitoring, and reports are not filed. Production requires authoritative data, validated models, secure access controls and legal/regulatory processes.
