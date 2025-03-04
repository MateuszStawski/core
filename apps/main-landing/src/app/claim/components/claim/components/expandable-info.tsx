import { Icon } from '@idriss-xyz/ui/icon';
import { Collapsible } from '@idriss-xyz/ui/collapsible';
import { ReactNode } from 'react';

import { EligibilityCriteriaTitle } from '../constants';

type Properties = {
  open: boolean;
  subTitle: string;
  positive: boolean;
  description: ReactNode;
  title: EligibilityCriteriaTitle;
  descriptionHasWrapper?: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ExpandableInfo = ({
  open,
  title,
  subTitle,
  positive,
  description,
  onOpenChange,
  descriptionHasWrapper,
}: Properties) => {
  return (
    <Collapsible
      controlled
      open={open}
      onOpenChange={onOpenChange}
      header={
        <div className="flex grow flex-row gap-2">
          {positive ? (
            <Icon name="Check" size={24} className="mr-2 text-mint-600" />
          ) : (
            <Icon name="X" size={24} className="mr-2 text-red-500" />
          )}
          <div className="flex w-full items-center justify-between gap-x-4">
            <h3 className="text-body4 text-neutralGreen-700">{title}</h3>
            <p className="text-body5 text-neutralGreen-500">{subTitle}</p>
          </div>
        </div>
      }
      content={
        <div className="flex flex-row">
          {descriptionHasWrapper ? (
            description
          ) : (
            <ul className="mt-3 pl-9 text-body5 text-neutralGreen-500">
              {description}
            </ul>
          )}
        </div>
      }
    />
  );
};
