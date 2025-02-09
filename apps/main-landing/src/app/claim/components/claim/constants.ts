export const ELIGIBILITY_CRITERIA_TITLES = {
  IDRISS_USER: 'IDRISS USER',
  GITCOIN_DONOR: 'GITCOIN DONOR',
  SALE_PARTICIPANT: 'SALE PARTICIPANT',
  PARTNER_COMMUNITY_MEMBER: 'PARTNER MEMBER',
} as const;

export type EligibilityCriteriaTitle =
  (typeof ELIGIBILITY_CRITERIA_TITLES)[keyof typeof ELIGIBILITY_CRITERIA_TITLES];
