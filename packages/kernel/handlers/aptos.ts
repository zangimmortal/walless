import { Networks } from '@walless/core';
import { collectibleState, collectionState } from '@walless/engine';
import { modules } from '@walless/ioc';
import type { Provider } from 'aptos';
import {
	APTOS_COIN,
	AptosAccount,
	CoinClient,
	FungibleAssetClient,
	HexString,
	TokenClient,
} from 'aptos';

export interface AptosCoinPayload {
	from: string;
	to: string;
	amount: number;
	decimals: number;
	token: string;
}

export const handleTransferCoin = async (
	privateKey: Uint8Array,
	transaction: string | AptosCoinPayload,
) => {
	let txData: AptosCoinPayload;
	if (typeof transaction === 'string') {
		txData = JSON.parse(transaction) as AptosCoinPayload;
	} else {
		txData = transaction;
	}

	const fromPubkey = new HexString(txData.from);
	const toPubkey = new HexString(txData.to);
	const fromAccount = new AptosAccount(privateKey, fromPubkey);
	const isNativeAPT = txData.token === APTOS_COIN;
	const connection = modules.engine.getConnection<Provider>(Networks.aptos);

	let txHash: string;

	if (isNativeAPT) {
		const coinClient = new CoinClient(connection.aptosClient);
		txHash = await coinClient.transfer(
			fromAccount,
			toPubkey,
			txData.amount * 10 ** txData.decimals,
			{
				createReceiverIfMissing: true,
			},
		);
		await connection.waitForTransaction(txHash);
	} else {
		const token = new HexString(txData.token);
		const fungibleClient = new FungibleAssetClient(connection);
		txHash = await fungibleClient.transfer(
			fromAccount,
			token,
			toPubkey,
			txData.amount * 10 ** txData.decimals,
		);
		await connection.waitForTransaction(txHash);
	}

	return txHash;
};

export interface AptosTokenPayload {
	wallessCollectionId: string;
	wallessCollectibleId: string;
	from: string;
	to: string;
	creator: string;
	collectionName: string;
	tokenName: string;
	amount: number;
}

export const handleTransferToken = async (
	privateKey: Uint8Array,
	transaction: string | AptosTokenPayload,
) => {
	let txData: AptosTokenPayload;
	if (typeof transaction === 'string') {
		txData = JSON.parse(transaction) as AptosTokenPayload;
	} else {
		txData = transaction;
	}

	const fromPubkey = new HexString(txData.from);
	const toPubkey = new HexString(txData.to);
	const creatorPubkey = new HexString(txData.creator);
	const fromAccount = new AptosAccount(privateKey, fromPubkey);

	const connection = modules.engine.getConnection<Provider>(Networks.aptos);
	const tokenClient = new TokenClient(connection.aptosClient);

	const resource = await connection.getAccountResource(
		toPubkey,
		'0x3::token::TokenStore',
	);
	const hasOptedIn = (
		resource.data as {
			direct_transfer: boolean;
		}
	).direct_transfer;

	let txHash: string = '';

	if (hasOptedIn) {
		txHash = await tokenClient.transferWithOptIn(
			fromAccount,
			creatorPubkey,
			txData.collectionName,
			txData.tokenName,
			0,
			toPubkey,
			txData.amount,
		);
	} else {
		txHash = await tokenClient.offerToken(
			fromAccount,
			toPubkey,
			creatorPubkey,
			txData.collectionName,
			txData.tokenName,
			txData.amount,
		);
	}

	await connection.waitForTransaction(txHash);

	collectibleState.map.delete(txData.wallessCollectibleId);
	const collection = collectionState.map.get(txData.wallessCollectionId);
	if (collection) {
		collection.count--;
		if (collection.count === 0) {
			collectionState.map.delete(txData.wallessCollectionId);
		}
	}

	return txHash;
};

export interface AptosDirectTransferPayload {
	pubkey: string;
	directTransfer: boolean;
}

export const handleUpdateDirectTransfer = async (
	privateKey: Uint8Array,
	transaction: string | AptosDirectTransferPayload,
) => {
	let txData: AptosDirectTransferPayload;
	if (typeof transaction === 'string') {
		txData = JSON.parse(transaction) as AptosDirectTransferPayload;
	} else {
		txData = transaction;
	}

	const directTransfer = txData.directTransfer;
	const pubkey = new HexString(txData.pubkey);
	const account = new AptosAccount(privateKey, pubkey);

	const connection = modules.engine.getConnection<Provider>(Networks.aptos);
	const tokenClient = new TokenClient(connection.aptosClient);

	const txHash = await tokenClient.optInTokenTransfer(account, directTransfer);
	await connection.waitForTransaction(txHash);

	return txHash;
};

export interface AptosClaimTokenPayload {
	pubkey: string;
	sender: string;
	creator: string;
	collectionName: string;
	name: string;
}

export const handleClaimToken = async (
	privateKey: Uint8Array,
	transaction: string | AptosClaimTokenPayload,
) => {
	let txData: AptosClaimTokenPayload;
	if (typeof transaction === 'string') {
		txData = JSON.parse(transaction) as AptosClaimTokenPayload;
	} else {
		txData = transaction;
	}

	const pubkey = new HexString(txData.pubkey);
	const account = new AptosAccount(privateKey, pubkey);
	const sender = new HexString(txData.sender);
	const creator = new HexString(txData.creator);
	const collectionName = txData.collectionName;
	const name = txData.name;

	const connection = modules.engine.getConnection<Provider>(Networks.aptos);
	const tokenClient = new TokenClient(connection.aptosClient);

	const txHash = await tokenClient.claimToken(
		account,
		sender,
		creator,
		collectionName,
		name,
	);
	await connection.waitForTransaction(txHash);

	return txHash;
};
