export const CLAIM_CONTENT = {
  CHECK_ELIGIBILITY: 'check-eligibility',
  CLAIM: 'claim',
  NOT_ELIGIBLE: 'not-eligible',
  VESTING_PLANS: 'vesting-plans',
  CLAIM_SUCCESSFUL: 'claim-successful',
  LETTER: 'letter',
  ABOUT_IDRISS: 'about-idriss',
} as const;

export type ClaimPageContent =
  (typeof CLAIM_CONTENT)[keyof typeof CLAIM_CONTENT];

export const ALEPH_LOGO =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNy44NTM3IDIxLjEyOTlIMzEuNjU3MUMzMS43MDIyIDIxLjEzIDMxLjc0NjggMjEuMTIxMiAzMS43ODg1IDIxLjEwNEMzMS44MzAxIDIxLjA4NjggMzEuODY3OSAyMS4wNjE2IDMxLjg5OTggMjEuMDI5N0MzMS45MzE3IDIwLjk5NzkgMzEuOTU2OSAyMC45NiAzMS45NzQxIDIwLjkxODRDMzEuOTkxMyAyMC44NzY3IDMyLjAwMDEgMjAuODMyMSAzMiAyMC43ODdWMTguMDQ0MkMzMiAxNy45NTMzIDMxLjk2MzkgMTcuODY2MSAzMS44OTk2IDE3LjgwMThDMzEuODM1MyAxNy43Mzc1IDMxLjc0ODEgMTcuNzAxMyAzMS42NTcxIDE3LjcwMTNIMjYuMzI3NkwyMi4xMjg4IDguMjcxMjRDMjIuMDkzIDguMTkwOTggMjIuMDM1IDguMTIyNzIgMjEuOTYxNCA4LjA3NDYyQzIxLjg4NzkgOC4wMjY1MSAyMS44MDIxIDguMDAwNjEgMjEuNzE0MyA4SDE4LjI4NTdDMTguMTk3NCA4LjAwMDAyIDE4LjExMDkgOC4wMjU2NSAxOC4wMzY4IDguMDczNzlDMTcuOTYyNyA4LjEyMTkzIDE3LjkwNDEgOC4xOTA1MSAxNy44NjgyIDguMjcxMjRMMTMuNjcyNCAxNy43MDEzSDguMzQyODZDOC4yNTE5MyAxNy43MDEzIDguMTY0NzIgMTcuNzM3NSA4LjEwMDQyIDE3LjgwMThDOC4wMzYxMiAxNy44NjYxIDggMTcuOTUzMyA4IDE4LjA0NDJWMjAuNzg3QzcuOTk5OSAyMC44MzIxIDguMDA4NyAyMC44NzY3IDguMDI1ODkgMjAuOTE4NEM4LjA0MzA5IDIwLjk2IDguMDY4MzQgMjAuOTk3OSA4LjEwMDIgMjEuMDI5N0M4LjEzMjA1IDIxLjA2MTYgOC4xNjk4OSAyMS4wODY4IDguMjExNTMgMjEuMTA0QzguMjUzMTggMjEuMTIxMiA4LjI5NzgxIDIxLjEzIDguMzQyODYgMjEuMTI5OUgxMi4xNDYzTDguMDMyIDMwLjM3NDlDOC4wMDg4MiAzMC40MjY5IDcuOTk4OTkgMzAuNDg0IDguMDAzNCAzMC41NDA4QzguMDA3OCAzMC41OTc2IDguMDI2MzEgMzAuNjUyNSA4LjA1NzI1IDMwLjcwMDRDOC4wODgxOSAzMC43NDgyIDguMTMwNTcgMzAuNzg3NiA4LjE4MDU4IDMwLjgxNUM4LjIzMDU4IDMwLjg0MjQgOC4yODY2MiAzMC44NTY5IDguMzQzNjIgMzAuODU3MUgxMS40MDQyQzExLjQ5MjYgMzAuODU3MSAxMS41NzkgMzAuODMxNSAxMS42NTMxIDMwLjc4MzNDMTEuNzI3MiAzMC43MzUyIDExLjc4NTggMzAuNjY2NiAxMS44MjE3IDMwLjU4NTlMMjAgMTIuMjE3MUwyOC4xNzgzIDMwLjU4NTlDMjguMjE0MiAzMC42NjY2IDI4LjI3MjggMzAuNzM1MiAyOC4zNDY5IDMwLjc4MzNDMjguNDIxIDMwLjgzMTUgMjguNTA3NCAzMC44NTcxIDI4LjU5NTggMzAuODU3MUgzMS42NTY0QzMxLjcxMzYgMzAuODU3MyAzMS43Njk5IDMwLjg0MzEgMzEuODIwMiAzMC44MTU4QzMxLjg3MDUgMzAuNzg4NiAzMS45MTMyIDMwLjc0OTMgMzEuOTQ0NCAzMC43MDEzQzMxLjk3NTYgMzAuNjUzNCAzMS45OTQzIDMwLjU5ODQgMzEuOTk4OCAzMC41NDE0QzMyLjAwMzQgMzAuNDg0NCAzMS45OTM1IDMwLjQyNzEgMzEuOTcwMyAzMC4zNzQ5TDI3Ljg1MzcgMjEuMTI5OVoiIGZpbGw9IiMwQTBBMEEiLz4KPC9zdmc+Cg==';

export const claimSteps = [
  {
    step: '01',
    title: 'Letter',
  },
  {
    step: '02',
    title: 'About IDRISS',
  },
  {
    step: '03',
    title: 'Claim your $IDRISS',
  },
];
