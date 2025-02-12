import { TransactionBlock } from '@mysten/sui.js';
import { VersionedTransaction } from '@solana/web3.js';
import {
	constructTransaction,
	constructTransactionAbstractFee,
} from '@walless/app';
import type { TransactionPayload } from '@walless/core';
import { logger, Networks } from '@walless/core';
import type { CreateAndSendFunction, HandleAptosFunction } from '@walless/ioc';
import { aptosHandler, solanaHandler, utils } from '@walless/kernel';
import type { ResponsePayload } from '@walless/messaging';
import { RequestType, ResponseCode } from '@walless/messaging';

export const createAndSend: CreateAndSendFunction = async (
	payload: TransactionPayload,
	passcode?: string,
) => {
	const res = {} as ResponsePayload;
	if (!passcode) {
		res.responseCode = ResponseCode.REQUIRE_PASSCODE;
		return res;
	}

	const transaction =
		payload.tokenForFee.metadata?.symbol === 'SOL'
			? await constructTransaction(payload)
			: await constructTransactionAbstractFee(payload);

	if (transaction instanceof VersionedTransaction) {
		let privateKey;
		try {
			privateKey = await utils.getPrivateKey(Networks.solana, passcode);
		} catch {
			res.responseCode = ResponseCode.WRONG_PASSCODE;
			return res;
		}

		try {
			if (payload.tokenForFee.metadata?.symbol === 'SOL') {
				res.signatureString = await solanaHandler.signAndSendTransaction(
					transaction,
					privateKey,
				);
			} else {
				res.signatureString =
					await solanaHandler.signAndSendTransactionAbstractionFee(
						transaction,
						privateKey,
					);
			}

			res.responseCode = ResponseCode.SUCCESS;
		} catch {
			res.responseCode = ResponseCode.ERROR;
			return res;
		}
	} else if (transaction instanceof TransactionBlock) {
		// TODO: implement transfer sui
		logger.debug('hello sui');
	} else if (payload.network == Networks.tezos) {
		// TODO: implement transfer tezos
		logger.debug('hello tezos');
	} else if (payload.network === Networks.aptos) {
		let privateKey;
		try {
			privateKey = await utils.getPrivateKey(Networks.aptos, passcode);
		} catch {
			res.responseCode = ResponseCode.WRONG_PASSCODE;
			return res;
		}

		const isCoinTransaction = !('creator' in transaction);

		try {
			if (isCoinTransaction) {
				res.signatureString = await aptosHandler.handleTransferCoin(
					privateKey,
					transaction as aptosHandler.AptosCoinPayload,
				);
			} else {
				res.signatureString = await aptosHandler.handleTransferToken(
					privateKey,
					transaction as aptosHandler.AptosTokenPayload,
				);
			}
			res.responseCode = ResponseCode.SUCCESS;
		} catch {
			res.responseCode = ResponseCode.ERROR;
			return res;
		}
	}

	return res;
};

export const handleAptosOnChainAction: HandleAptosFunction = async ({
	passcode,
	type,
	payload,
}) => {
	const res = {} as ResponsePayload;

	let privateKey;
	try {
		privateKey = await utils.getPrivateKey(Networks.aptos, passcode);
	} catch {
		res.responseCode = ResponseCode.WRONG_PASSCODE;
		return res;
	}

	try {
		switch (type) {
			case RequestType.UPDATE_DIRECT_TRANSFER_ON_APTOS:
				res.signatureString = await aptosHandler.handleUpdateDirectTransfer(
					privateKey,
					payload as aptosHandler.AptosDirectTransferPayload,
				);
				break;

			case RequestType.CLAIM_TOKEN_ON_APTOS:
				res.signatureString = await aptosHandler.handleClaimToken(
					privateKey,
					payload as aptosHandler.AptosClaimTokenPayload,
				);
				break;

			default:
				break;
		}

		res.responseCode = ResponseCode.SUCCESS;
	} catch {
		res.responseCode = ResponseCode.ERROR;
	}

	return res;
};
