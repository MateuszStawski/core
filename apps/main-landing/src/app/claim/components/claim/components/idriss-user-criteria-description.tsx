import { classes } from '@idriss-xyz/ui/utils';

import { EligibilityCheckResponse } from '@/app/claim/types';

type Properties = {
  eligibilityData: EligibilityCheckResponse;
  liBaseClassName: string;
};

export const formatNumber = (value: number | undefined, digits = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: value && value % 1 !== 0 ? digits : 0,
    maximumFractionDigits: digits,
  }).format(value ?? 0);
};

const formatDate = (date: string | undefined) => {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date ?? ''));
};

export const IdrissUserCriteriaDescription = ({
  eligibilityData,
  liBaseClassName,
}: Properties) => {
  return (
    <ul className="flex list-none flex-col gap-3 pl-5">
      <li
        className={classes(
          liBaseClassName,
          (eligibilityData.allocation_paid ||
            eligibilityData.allocation_free) &&
            'before:text-mint-600',
        )}
      >
        <p>
          You registered
          {eligibilityData.paid
            ? ` ${eligibilityData.paid} paid account${eligibilityData.paid > 1 ? 's' : ''}`
            : ''}
          {eligibilityData.paid && eligibilityData.free ? ' and' : ''}
          {eligibilityData.free
            ? ` ${eligibilityData.free} free account${eligibilityData.free > 1 ? 's' : ''}`
            : ''}
          {!eligibilityData.paid && !eligibilityData.free && 'an account'}
        </p>
        <p>
          {formatNumber(
            Number(eligibilityData.allocation_paid ?? 0) +
              Number(eligibilityData.allocation_free ?? 0),
          )}
        </p>
      </li>
      <li
        className={classes(
          liBaseClassName,
          eligibilityData.allocation_extension && 'before:text-mint-600',
        )}
      >
        <p>
          You made transfers on 2 unique days with{'\u00A0'}the{'\u00A0'}browser
          extension
        </p>
        <p>{formatNumber(eligibilityData.allocation_extension)}</p>
      </li>
      <li
        className={classes(
          liBaseClassName,
          eligibilityData.time_multiplier > 1 && 'before:text-mint-600',
        )}
      >
        <p>
          Early user multiplier
          {eligibilityData.time_multiplier > 1 &&
            `: you registered the account\u00A0on ${formatDate(eligibilityData.registration)}`}
        </p>
        <p>
          x{'\u00A0'}
          {formatNumber(eligibilityData.time_multiplier, 2)}
        </p>
      </li>
      <li
        className={classes(
          liBaseClassName,
          eligibilityData.invite_multiplier > 1 && 'before:text-mint-600',
        )}
      >
        <p>
          Referral multiplier{' '}
          {eligibilityData.invite_multiplier > 1 &&
            `: you invited ${eligibilityData.invites} users`}
        </p>
        <p>
          x{'\u00A0'}
          {formatNumber(eligibilityData.invite_multiplier, 2)}
        </p>
      </li>
    </ul>
  );
};
