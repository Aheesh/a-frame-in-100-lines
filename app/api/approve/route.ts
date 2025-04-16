import * as dotenv from 'dotenv';
dotenv.config();
import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { DEGEN_ADDR, NEXT_PUBLIC_URL, PLAYER_B_ADDR, POOL_ID } from '../../config';
import { BalancerSDK, Network, SwapType } from '@balancer-labs/sdk';
import { ethers } from 'ethers';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  console.log('body', body);
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  //QueryBatchSwap to get the expected amount of tokens Out for confirmation
  const providerApiKey = process.env.BASE_PROVIDER_API_KEY;

  const sdk = new BalancerSDK({
    network: Network.BASE,
    rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${providerApiKey}`,
  });

  const tokenIn = DEGEN_ADDR;
  const tokenOut = PLAYER_B_ADDR; //TODO should be based on the option selected

  const swaps = [
    {
      poolId: POOL_ID,
      assetInIndex: 0,
      assetOutIndex: 1,
      amount: String(1e18), //TODO get the amount from the user
      userData: '0x',
    },
  ];
  const assets = [tokenIn, tokenOut];

  const queryInfo = await sdk.swaps.queryBatchSwap({
    kind: SwapType.SwapExactIn,
    swaps,
    assets,
  });
  console.log('queryInfo', queryInfo);
  const absValue = Math.abs(Number(ethers.utils.formatEther(queryInfo[1])));
  console.log('queryInfo', absValue);

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'tx',
          label: `Get ${absValue} tokens`,
          target: `${NEXT_PUBLIC_URL}/api/swap`,
        },
        { action: 'link', label: 'Cancel Transaction', target: `${NEXT_PUBLIC_URL}` },
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
