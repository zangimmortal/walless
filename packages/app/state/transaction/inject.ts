import type { Networks, TransactionPayload } from '@walless/core';
import { logger } from '@walless/core';
import { tokenState } from '@walless/engine';
import type { ResponsePayload } from '@walless/messaging';
import type {
	CollectibleDocument,
	CollectionDocument,
	PublicKeyDocument,
	TokenDocument,
} from '@walless/store';
import { proxy } from 'valtio';

const { map } = tokenState;
const tokens = Array.from(map.values());

export interface InjectedElements {
	tokens: TokenDocument[];
	tokenForFee: TokenDocument;
	nftCollections: CollectionDocument[];
	nftCollectibles: CollectibleDocument[];
	publicKeys: PublicKeyDocument[];
	getTransactionFee: (payload: TransactionPayload) => Promise<number>;
	getTransactionAbstractFee: (payload: TransactionPayload) => Promise<number>;
	handleClose: () => void;
	checkValidAddress: (
		keyStr: string,
		network: Networks,
	) => { valid: boolean; message: string };
	createAndSendTransaction: (
		payload: TransactionPayload,
		passcode?: string,
	) => Promise<ResponsePayload>;
	handleSendNftSuccess?: (collectible: CollectibleDocument) => void;
	network?: Networks;
}

export const injectedElements = proxy<InjectedElements>({
	tokens: [],
	tokenForFee: tokens[0],
	nftCollections: [],
	nftCollectibles: [],
	publicKeys: [],
	getTransactionFee: async () => 0,
	getTransactionAbstractFee: async () => 0,
	handleClose: () => logger.info('close'),
	checkValidAddress: () => {
		return { valid: true, message: '' };
	},
	createAndSendTransaction: async () => {
		return {};
	},
});
