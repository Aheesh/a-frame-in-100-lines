//Route to set state for user wallet address, Game outcome token selection and input for DEGEN to wager.

import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { PLAYER_A_ADDR, DRAW_ADDR, PLAYER_B_ADDR, NEXT_PUBLIC_URL } from '../../config';
import { addHyperFrame, getHyperFrame } from '../../hyperframes';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let token: string | undefined = '';
  let text: string | undefined = '';
  let frame: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
    console.log('Selected Account', accountAddress);
    console.log('Button no', message?.button);
    const btnIndex = body?.untrustedData.buttonIndex; // 1, 2, or 3
    console.log('Selected Token', btnIndex);
    token = btnIndex === 1 ? PLAYER_A_ADDR : btnIndex === 2 ? PLAYER_B_ADDR : DRAW_ADDR;
    console.log('Selected Token Address', token);
  } else {
    return new NextResponse('Message not valid', { status: 500 });
  }

  let state = { frame: 'start' };

  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
    console.log('State', state);
  } catch (e) {
    // Note that this error will always be triggered by the first frame
    console.error(e);
  }

  if (!frame) {
    return new NextResponse('Frame not found', { status: 404 });
  }

  // There should always be a button number
  if (!message?.button) {
    console.log('Button', message?.button);
    return new NextResponse('Button not found', { status: 404 });
  }

  // return new NextResponse(getHyperFrame(frame as string, text || '', message?.button));

  return new NextResponse(
    // TODO: Return a frame
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'tx',
          label: 'XL (100 $DEGEN)',
          target: `${NEXT_PUBLIC_URL}/api/approve`,
        },
        {
          action: 'tx',
          label: '2XL (200 $DEGEN)',
          target: `${NEXT_PUBLIC_URL}/api/approve`,
        },
        {
          action: 'tx',
          label: '5XL (500 $DEGEN)',
          target: `${NEXT_PUBLIC_URL}/api/approve`,
        },
        {
          action: 'tx',
          label: 'ALL-IN (1000 $DEGEN)',
          target: `${NEXT_PUBLIC_URL}/api/approve`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/park-1.png`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
