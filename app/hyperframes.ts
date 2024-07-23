import { getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NEXT_PUBLIC_URL } from './config';

export type HyperFrame = {
  frame: string;
  1: string | ((text: string) => string) | (() => string);
  2?: string | ((text: string) => string) | (() => string);
  3?: string | ((text: string) => string) | (() => string);
  4?: string | ((text: string) => string) | (() => string);
};

const frames: Record<string, HyperFrame> = {};

export function addHyperFrame(label: string, frame: HyperFrame) {
  frames[label] = frame;
}

export function getHyperFrame(frame: string, text: string, button: number) {
  const currentFrame = frames[frame];
  const nextFrameIdOrFunction = currentFrame[button as keyof HyperFrame];

  let nextFrameId: string;
  if (typeof nextFrameIdOrFunction === 'function') {
    nextFrameId = nextFrameIdOrFunction(text);
  } else {
    nextFrameId = nextFrameIdOrFunction as string;
  }

  if (!frames[nextFrameId]) {
    throw new Error(`Frame not found: ${nextFrameId}`);
  }

  return frames[nextFrameId].frame;
}

addHyperFrame('start', {
  frame: getFrameHtmlResponse({
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
    state: { frame: 'start' },
    postUrl: `${NEXT_PUBLIC_URL}/api/approve`,
  }),
  1: 'road',
  2: 'woods-bear',
  3: 'cave-1',
});
