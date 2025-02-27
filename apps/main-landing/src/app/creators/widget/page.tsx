'use client';
import { Hex } from 'viem';
import '@rainbow-me/rainbowkit/styles.css';
import { useEffect, useState } from 'react';
import { default as io } from 'socket.io-client';
import _ from 'lodash';
import { useSearchParams } from 'next/navigation';

import { useGetTipHistory } from '@/app/creators/donate/commands/get-donate-history';
import { FormValues, WidgetVariants } from '@/app/creators/widget/types';

import { TopDonors } from '../donate/top-donors';
import { RainbowKitProviders } from '../donate/providers';
import { ZapperNode } from '../donate/types';

const SOCKET_URL = 'https://core-production-a116.up.railway.app';

// ts-unused-exports:disable-next-line
export default function Widget() {
  return (
    <RainbowKitProviders>
      <WidgetContent />
    </RainbowKitProviders>
  );
}

function WidgetContent() {
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [tipEdges, setTipEdges] = useState<{ node: ZapperNode }[]>([]);
  const [address, setAddress] = useState<Hex | null | undefined>(
    '0x42d4cb836571e60ffc84a6cdbeaa2f0d2240c2bd',
  );

  const searchParameters = useSearchParams();
  const variant = searchParameters.get('variant');
  const widgetVariant: WidgetVariants = [
    'panel',
    'videoOverlay',
    'videoComponent',
    null,
  ].includes(variant)
    ? (variant as WidgetVariants)
    : null;
  const isVideoOverlay = widgetVariant === 'videoOverlay';

  useEffect(() => {
    if (!window.Twitch?.ext) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.Twitch.ext.onAuthorized(() => {
      const storedConfig = window.Twitch.ext.configuration.broadcaster?.content;

      if (storedConfig) {
        const parsedConfig: FormValues = JSON.parse(storedConfig);
        setAddress(parsedConfig.address as Hex);
      } else {
        // setAddress(null);
      }
    });
  }, []);

  const tips = useGetTipHistory(
    { address: address ?? '0x' },
    { enabled: !!address },
  );

  useEffect(() => {
    if (tips.data) {
      setTipEdges(tips.data.data);
    }
  }, [tips.data]);

  useEffect(() => {
    if (address && !socketInitialized) {
      const socket = io(SOCKET_URL);
      setSocketInitialized(true);

      if (socket && !socketConnected) {
        socket.on('connect', () => {
          socket.emit('register', address);

          if (socket.connected) {
            setSocketConnected(true);
          }
        });

        socket.on('newDonation', (node: ZapperNode) => {
          setTipEdges((previousState) => {
            return _.uniqBy([{ node }, ...previousState], (item) => {
              return _.get(item, 'node.transaction.hash');
            });
          });
        });
      }

      return () => {
        if (socket.connected) {
          socket.disconnect();
          setSocketConnected(false);
        }
      };
    }

    return;
  }, [address, socketConnected, socketInitialized]);

  return (
    <>
      {isVideoOverlay ? (
        <div className="relative flex size-full items-start justify-end pr-28 pt-20">
          <TopDonors
            tipEdges={tipEdges}
            variant={widgetVariant}
            validatedAddress={address}
            tipsLoading={tips.isLoading}
            className="absolute right-0 top-0 scale-75 overflow-hidden px-0"
          />
        </div>
      ) : (
        <TopDonors
          tipEdges={tipEdges}
          variant={widgetVariant}
          validatedAddress={address}
          tipsLoading={tips.isLoading}
          className="overflow-hidden px-0"
        />
      )}

      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js" />
    </>
  );
}
