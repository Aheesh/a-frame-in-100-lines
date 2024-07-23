import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      action: 'tx',
      label: 'Player A',
      target: `${NEXT_PUBLIC_URL}/api/skinIn`,
    },
    {
      action: 'tx',
      label: 'Player B',
      target: `${NEXT_PUBLIC_URL}/api/skinIn`,
    },
    {
      action: 'tx',
      label: 'Draw ',
      target: `${NEXT_PUBLIC_URL}/api/skinIn`,
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/game1.webp`,
    aspectRatio: '1:1',
  },
  // input: {
  //   text: 'Enter amount (default: 100)',
  // },
  postUrl: `${NEXT_PUBLIC_URL}/api/approve`,
});

export const metadata: Metadata = {
  title: 'Baller Chess',
  description: 'Game 1',
  openGraph: {
    title: 'Baller Chess',
    description: 'Toy Game 1 - Who will win ? ',
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Default Page for Baller Chess</h1>
    </>
  );
}
