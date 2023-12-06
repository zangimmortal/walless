import { randomBytes } from 'crypto';

import {
	convertPublicKeyToX25519,
	convertSecretKeyToX25519,
	type KeyPair,
} from '@stablelib/ed25519';
import { openSecretBox, secretBox } from '@stablelib/nacl';
import {
	clientSessionKeys,
	serverSessionKeys,
	type SessionKeys,
} from '@stablelib/x25519-session';

export const secretbox_NONCEBYTES = 24;
export const secretbox_MACBYTES = 16;

export const createCryptoBoxClient = async (
	otherPublicKey: string,
	keypair: KeyPair,
): Promise<SessionKeys> => {
	return clientSessionKeys(
		{
			publicKey: convertPublicKeyToX25519(keypair.publicKey),
			secretKey: convertSecretKeyToX25519(keypair.secretKey),
		},
		convertPublicKeyToX25519(Buffer.from(otherPublicKey, 'hex')),
	);
};

export const createCryptoBoxServer = async (
	otherPublicKey: string,
	keypair: KeyPair,
): Promise<SessionKeys> => {
	return serverSessionKeys(
		{
			publicKey: convertPublicKeyToX25519(keypair.publicKey),
			secretKey: convertSecretKeyToX25519(keypair.secretKey),
		},
		convertPublicKeyToX25519(Buffer.from(otherPublicKey, 'hex')),
	);
};

export const encryptMessage = async (
	recipientPublicKey: string,
	keypair: KeyPair,
	message: string,
) => {
	const nonce = Buffer.from(randomBytes(secretbox_NONCEBYTES));
	const sharedKey = await createCryptoBoxClient(recipientPublicKey, keypair);

	const combinedPayload = Buffer.concat([
		nonce,
		Buffer.from(
			secretBox(sharedKey.receive, nonce, Buffer.from(message, 'utf-8')),
		),
	]);

	return combinedPayload.toString('hex');
};

export const decryptMessage = async (
	payload: Uint8Array,
	recipientPublicKey: string,
	keypair: KeyPair,
) => {
	const sharedKey = await createCryptoBoxClient(recipientPublicKey, keypair);
	const nonce = payload.slice(0, secretbox_NONCEBYTES);
	const ciphertext = payload.slice(secretbox_NONCEBYTES);

	const openBox = openSecretBox(sharedKey.receive, nonce, ciphertext);

	if (!openBox) {
		throw new Error('Could not decrypt message');
	}

	return Buffer.from(openBox).toString('utf-8');
};

export { generateKeyPair } from '@stablelib/ed25519';
