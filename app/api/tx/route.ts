import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther, parseUnits, toHex, pad } from 'viem';
import { base, baseSepolia, sepolia } from 'viem/chains';
import { BAL_VAULT_ADDR, DEGEN_ADDR, PLAYER_A_ADDR, DRAW_ADDR, PLAYER_B_ADDR } from '../../config';
import abi from '../../_contracts/tokenStable';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  // Remember to replace 'NEYNAR_ONCHAIN_KIT' with your own Neynar API key
  let { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }
  console.log('Message Body', body);
  const amount = body?.untrustedData.inputText;
  console.log('Amount', amount);
  const btnIndex = body?.untrustedData.buttonIndex; // 1, 2, or 3
  console.log('Selected Token', btnIndex);
  const selectedToken = btnIndex === 1 ? PLAYER_A_ADDR : btnIndex === 2 ? PLAYER_B_ADDR : DRAW_ADDR;
  console.log('Selected Token Address', selectedToken);
  const value = parseUnits(amount, 18); //TODO get the amount from the user

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
      to: DEGEN_ADDR,
      value: '0',
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
