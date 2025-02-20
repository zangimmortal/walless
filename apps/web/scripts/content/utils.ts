import type { UnknownObject } from '@walless/core';
import {
	extractPublicKeyFromSecretKey,
	generateKeyPair,
} from '@walless/crypto/utils/p2p';
import { decode, encode } from 'bs58check';

export const injectScript = (scriptUri: string) => {
	try {
		const container = document.head || document.documentElement;
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('async', 'false');
		scriptTag.src = chrome.runtime.getURL(scriptUri);
		container.insertBefore(scriptTag, container.children[0]);
		container.removeChild(scriptTag);
	} catch (error) {
		console.error('script injection failed.', error);
	}
};

export const serialize = (data: UnknownObject): string => {
	return encode(Buffer.from(JSON.stringify(data)));
};

export const deserialize = (encoded: string): UnknownObject => {
	return JSON.parse(decode(encoded).toString());
};

export const getOrCreateKeypair = async (origin: string, create = false) => {
	if (!origin) throw Error('require origin');

	const key = 'transport_secret_key:' + origin;
	if (create) {
		const keypair = generateKeyPair();
		chrome.storage.local.set({
			[key]: Buffer.from(keypair.secretKey).toString('hex'),
		});

		return keypair;
	} else {
		const result = await chrome.storage.local.get([key]);
		const secretKeyString = result[key] as string;

		if (secretKeyString) {
			const secretKey = new Uint8Array(Buffer.from(secretKeyString, 'hex'));
			const keypair = {
				publicKey: extractPublicKeyFromSecretKey(secretKey),
				secretKey,
			};

			return keypair;
		} else {
			const keypair = generateKeyPair();
			chrome.storage.local.set({
				transport_secret_key: Buffer.from(keypair.secretKey).toString('hex'),
			});

			return keypair;
		}
	}
};

export const storeDAppPublicKey = async (origin: string, publicKey: string) => {
	if (!origin) throw Error('require origin');
	const key = 'dapp_public_key:' + origin;
	await chrome.storage.local.set({ [key]: publicKey });

	return publicKey;
};

export const getDAppPublicKey = async (origin: string) => {
	if (!origin) throw Error('require origin');

	const key = 'dapp_public_key:' + origin;
	const result = await chrome.storage.local.get([key]);
	const publicKey = result[key];

	if (!publicKey) throw Error('Not found dapp public key');

	return publicKey;
};
