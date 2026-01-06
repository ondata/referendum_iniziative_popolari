## ADDED Requirements

### Requirement: Home sorting by quorum percentage
The home page SHALL offer a sorting option that orders initiatives by the percentage of signatures collected relative to the quorum in descending order.

#### Scenario: Sort by quorum percentage descending
- **WHEN** the user selects the quorum-percentage sort on the home page
- **THEN** initiatives are ordered by (sostenitori / quorum) * 100 from highest to lowest
- **AND** initiatives with missing or zero sostenitori/quorum are treated as 0% and appear at the end
- **AND** the card visuals remain unchanged
