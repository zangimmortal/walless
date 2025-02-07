import { InMemorySigner } from '@taquito/signer';
import { tezosHandler } from '@walless/kernel';
import { ResponseCode } from '@walless/messaging';
import { encode } from 'bs58';

import { respond } from '../utils/requestPool';
import type { HandleMethod } from '../utils/types';

export const signPayload: HandleMethod<{
	privateKey?: Uint8Array;
	payload?: string;
}> = async ({ payload }) => {
	if (!payload.privateKey || !payload.payload) {
		throw Error('Missing privateKey or message');
	}

	const privateKey = encode(payload.privateKey);
	const signer = await InMemorySigner.fromSecretKey(privateKey);
	const { prefixSig } = await signer.sign(payload.payload as string);

	respond(payload.requestId, ResponseCode.SUCCESS, { signature: prefixSig });
};

export const transferToken: HandleMethod<{
	privateKey?: Uint8Array;
	transaction?: string;
}> = async ({ payload }) => {
	if (!payload.privateKey || !payload.transaction) {
		throw Error('Missing privateKey or transaction');
	}

	const hash = await tezosHandler.transferToken(
		payload.transaction,
		payload.privateKey,
	);

	respond(payload.requestId, ResponseCode.SUCCESS, { hash });
};
