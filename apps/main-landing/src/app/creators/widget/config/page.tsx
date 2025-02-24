'use client';
import '@rainbow-me/rainbowkit/styles.css';
import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { useEffect, useState } from 'react';
import { Hex } from 'viem';
import Script from 'next/script';

import { backgroundLines2, backgroundLines3 } from '@/assets';

const EMPTY_CONFIG_FORM_VALUES = {
  address: '0x',
};

export default function Config() {
  const [address, setAddress] = useState<Hex | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: EMPTY_CONFIG_FORM_VALUES,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = (payload: typeof EMPTY_CONFIG_FORM_VALUES) => {
    if (window.Twitch?.ext) {
      window.Twitch.ext.onAuthorized(() => {
        window.Twitch.ext.configuration.set(
          'broadcaster',
          '1',
          JSON.stringify({ address: payload.address }),
        );
        alert('Address saved successfully!');
      });
    } else {
      console.error('Twitch extension is not available.');
    }
  };

  useEffect(() => {
    if (isClient && window.Twitch?.ext) {
      window.Twitch.ext.onAuthorized((auth) => {
        if (auth.channelId) {
          const storedConfig =
            window.Twitch.ext.configuration.broadcaster.content;
          if (storedConfig) {
            const parsedConfig = JSON.parse(storedConfig);
            if (parsedConfig.address) {
              setAddress(parsedConfig.address);
            }
          }
        }
      });
    }
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
          alt=""
        />

        <div className="relative z-1 flex w-[440px] max-w-full flex-col items-center rounded-xl bg-white px-4 pb-9 pt-6">
          <link rel="preload" as="image" href={backgroundLines3.src} />
          <img
            src={backgroundLines3.src}
            className="pointer-events-none absolute top-0 hidden h-full opacity-100 lg:block"
            alt=""
          />

          <h1 className="self-start text-heading4">Setup your panel</h1>

          <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Controller
              control={control}
              name="address"
              render={({ field }) => {
                return (
                  <Form.Field
                    {...field}
                    className="mt-6"
                    value={field.value}
                    label="Wallet address"
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                );
              }}
            />

            <Button
              type="submit"
              intent="primary"
              size="medium"
              className="mt-6 w-full"
            >
              SAVE
            </Button>
          </Form>

          <div className="mt-4">
            <p>Current saved address:</p>
            <p>{address ?? 'No address set'}</p>
          </div>
        </div>
      </main>
      <Script
        src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
