import * as Switch from '@radix-ui/react-switch';

import { classes } from 'shared/ui/utils';

import { ToggleProperties } from './toggle.types';

export const Toggle = ({ value, onChange }: ToggleProperties) => {
  return (
    <Switch.Root
      className={classes(
        'relative mx-4 h-2.5 w-[30px] rounded-[5px] bg-[#bdc1c6] shadow-[0_1px_3px_0_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out',
        {
          'bg-[#11dd7488]': value,
        },
      )}
      onCheckedChange={(value) => {
        onChange(value);
      }}
      checked={value}
    >
      <Switch.Thumb
        className={classes(
          'absolute -top-[5px] block size-5 -translate-x-[10px] rounded-full bg-black shadow-[0_1px_3px_0_rgba(0,0,0,0.4)] transition-all duration-300 data-[state=checked]:translate-x-[20px]',
          { 'bg-[#11dd74]': value },
        )}
      />
    </Switch.Root>
  );
};
