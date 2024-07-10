import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther, parseUnits, toHex, pad } from 'viem';
import { base, baseSepolia, sepolia } from 'viem/chains';
import { BAL_VAULT_ADDR } from '../../config';
import abi from '../../_contracts/tokenStable';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  // Remember to replace 'NEYNAR_ONCHAIN_KIT' with your own Neynar API key
  let { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const value = parseUnits('1', 18);

  const data = encodeFunctionData({
    abi: abi,
    functionName: 'approve',
    args: [BAL_VAULT_ADDR, value],
  });

  //TODO check if the wallet has enough balance to send the transaction, check the balance of the wallet and request permission only for required amount.
  const txData: FrameTransactionResponse = {
    chainId: `eip155:${base.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: abi,
      data: data,
      to: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
      value: '0',
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
