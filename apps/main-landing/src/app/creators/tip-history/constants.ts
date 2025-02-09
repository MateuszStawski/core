import { gql } from '@apollo/client';

export const TipHistoryQuery = gql`
  query ($addresses: [Address!], $isSigner: Boolean) {
    accountsTimeline(addresses: $addresses, isSigner: $isSigner, first: 10) {
      edges {
        node {
          timestamp
          network
          transaction {
            hash
            fromUser {
              address
            }
            toUser {
              address
            }
          }
          interpretation {
            descriptionDisplayItems {
              ... on TokenDisplayItem {
                network
                amountRaw
                tokenV2 {
                  symbol
                  imageUrlV2
                  marketData {
                    price
                  }
                }
              }
              ... on StringDisplayItem {
                stringValue
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
