import { type MessengerCallback, RequestType } from '@walless/messaging';

import * as coordinator from '../utils/coordinator';
import { getNetwork } from '../utils/handler';

import { handleConnect } from './connect';
import * as solanaHandler from './solanaHandler';
import * as suiHandler from './suiHandler';

export const onKernelMessage: MessengerCallback = async (payload, channel) => {
	const { type, requestId } = payload;

	if (requestId) {
		let handleMethod;
		let requirePrivateKey = true;

		if (type === RequestType.REQUEST_CONNECT) {
			handleMethod = handleConnect;
			requirePrivateKey = false;
		} else if (type == RequestType.GET_ENDPOINT_ON_SOLANA) {
			solanaHandler.getEndpoint(payload, channel);
			requirePrivateKey = false;
		} else if (type === RequestType.REQUEST_PAYLOAD) {
			coordinator.handleRequestPayload(payload, channel);
		} else if (type === RequestType.SIGN_MESSAGE_ON_SOLANA) {
			handleMethod = solanaHandler.signMessage;
		} else if (type === RequestType.SIGN_TRANSACTION_ON_SOLANA) {
			handleMethod = solanaHandler.signTransaction;
		} else if (type === RequestType.SIGN_SEND_TRANSACTION_ON_SOLANA) {
			handleMethod = solanaHandler.signAndSendTransaction;
		} else if (type === RequestType.SIGN_MESSAGE_ON_SUI) {
			suiHandler.handleSignMessage(payload, channel);
		} else if (type === RequestType.SIGN_TRANSACTION_ON_SUI) {
			suiHandler.handleSignTransaction(payload, channel);
		} else if (type === RequestType.SIGH_EXECUTE_TRANSACTION_ON_SUI) {
			suiHandler.handleSignAndExecuteTransaction(payload, channel);
		} else {
			return channel.postMessage({
				from: 'walless@kernel',
				requestId: payload.requestId,
				message: 'Invalid request type!',
			});
		}

		const network = getNetwork(type);

		if (handleMethod)
			coordinator.handle(
				channel,
				payload,
				handleMethod,
				requirePrivateKey,
				network,
			);
	}
};
