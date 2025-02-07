import type { Metadata as MplMetadata } from '@metaplex-foundation/mpl-token-metadata';
import type { SuiObjectData } from '@mysten/sui.js';

import type { Endpoint, Networks } from './commonTypes';

export interface AptosTokenMetadata {
	creatorAddress: string;
	ownerAddress: string;
	collectionId: string;
	collectionName: string;
	collectionUri: string;
	tokenId: string;
	tokenName: string;
	tokenImageUri: string;
	tokenDescription: string;
}

export interface System {
	deviceId?: string;
}

export interface Setting {
	profile: UserProfile;
	config: Config;
}

export type EndpointMap = Record<Networks, Endpoint>;

export interface Config {
	version?: string;
	hideBalance: boolean;
	latestLocation: string | MobileNavigation;
	notificationToken?: string;
}

export interface MobileNavigation {
	name: string;
	params?: Readonly<object | undefined>;
}

export interface RemoteConfig {
	experimentalEnabled: boolean;
	deepAnalyticsEnabled: boolean;
	minimalVersion: string;
}

export interface UserProfile {
	id?: string;
	email?: string;
	name?: string;
	walletCount?: number;
	profileImage?: string;
}

export interface AssetMetadata {
	name?: string;
	symbol?: string;
	imageUri?: string;
	mpl?: MplMetadata;
	sod?: SuiObjectData;
	aptosToken?: AptosTokenMetadata;
	description?: string;
	attributes?: {
		key: string;
		value: string;
	}[];
}

export interface TokenAccount {
	mint?: string;
	owner?: string;
	address?: string;
	quotes?: Record<string, number>;
	balance: string;
	decimals: number;

	/**
	 * This attribute is used for tezos token identifier
	 * (combine with address - smart contract address)
	 * */
	tokenId?: number;
}

export interface Token {
	network: string;
	account: TokenAccount;
	metadata?: AssetMetadata;
}

export interface Collection {
	network: string;
	metadata?: AssetMetadata;
	count: number;
}

export interface CollectibleAccount {
	mint: string;
	owner: string;
	amount: number;
}

export interface Collectible {
	network: string;
	collectionId: string;
	metadata: AssetMetadata;
	account: CollectibleAccount;
}

export interface TrustedDomain {
	trusted: boolean;
	connectCount: number;
	connect: boolean;
}
