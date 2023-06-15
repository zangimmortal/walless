import { type MiniBroadcast, type UnknownObject } from '@walless/core';

import { type ResponseMethod } from './types';
const requestPool: Record<
	string,
	{
		channel: MiniBroadcast;
		payload: UnknownObject;
	}
> = {};

export const response: ResponseMethod = (
	to,
	responseCode,
	responsePayload = {},
) => {
	console.log(requestPool, to);
	const { channel } = requestPool[to];

	channel.postMessage({
		from: 'walless@kernel',
		requestId: to,
		responseCode,
		...responsePayload,
	});

	removeRequestRecord(to);
};

export const removeRequestRecord = (requestId: string) => {
	delete requestPool[requestId];
};

export const addRequestRecord = (
	requestId: string,
	channel: MiniBroadcast,
	payload: UnknownObject,
) => {
	requestPool[requestId] = { channel, payload };
};

export const getRequestRecord = (requestId: string) => {
	return requestPool[requestId];
};
