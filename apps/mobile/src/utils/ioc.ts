import Config from 'react-native-config';
import WebSQLite from 'react-native-quick-websql';
import { firebase } from '@react-native-firebase/auth';
import { createEngine } from '@walless/engine';
import { modules, utils } from '@walless/ioc';
import { createEncryptionKeyVault } from '@walless/messaging';
import { configure, create } from '@walless/store';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';

import { nativeAsset } from './config';
import { initializeAuth, universalAnalytics } from './firebase';
import { qlClient } from './graphql';
import { navigate } from './navigation';
import { createAndSend, handleAptosOnChainAction } from './transaction';
import { key } from './w3a';

export const injectModules = async () => {
	const startTime = new Date();
	const SQLiteAdapter = SQLiteAdapterFactory(WebSQLite);
	const storage = create('engine', SQLiteAdapter);

	utils.createAndSend = createAndSend;
	utils.handleAptosFunction = handleAptosOnChainAction;
	utils.logOut = logOut;
	// TODO: implement and inject buy token here

	modules.analytics = universalAnalytics;
	modules.asset = nativeAsset;
	modules.config = Config;
	modules.storage = storage;
	modules.qlClient = qlClient;
	modules.thresholdKey = key as never;
	modules.encryptionKeyVault = createEncryptionKeyVault(modules.storage);

	await configure(storage); // pouchdb setup, should be lighting fast
	await initializeAuth(); // some of its dependency triggered without await causing fast complete/resolve
	modules.engine = await createEngine();
	modules.engine.start();

	const endTime = new Date();
	const milliseconds = endTime.getMilliseconds() - startTime.getMilliseconds();
	console.log(`Took ${milliseconds} milliseconds to configure IoC module`);

	return modules;
};

export default modules;

const logOut = async () => {
	await firebase.auth().signOut();
	await modules.storage.clearAllDocs();

	navigate('Authentication', { screen: 'Login' });
};
