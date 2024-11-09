import {
  CHROME_EXTENSION_LINK,
  DOCUMENTATION_LINK,
} from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';
export const ExtensionSectionActions = () => {
  return (
    <>
      <Button
        intent="secondary"
        size="large"
        className="w-full md:w-fit"
        asLink
        href={CHROME_EXTENSION_LINK}
        isExternal
      >
        DOWNLOAD EXTENSION
      </Button>
      <Button
        intent="tertiary"
        size="large"
        className="text-neutral-100"
        asLink
        href={DOCUMENTATION_LINK}
        isExternal
      >
        LEARN MORE
      </Button>
    </>
  );
};