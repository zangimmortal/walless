import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
	modalActions,
	ModalManager,
	paperTheme,
	themeActions,
	View,
} from '@walless/gui';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import 'raf/polyfill';

import '../styles/global.css';

themeActions.setTheme(paperTheme);

export const App: FC<AppProps> = ({ Component, pageProps }) => {
	const [, setRender] = useState({});
	const containerRef = useRef(null);

	useEffect(function updateState() {
		//  This effect makes reanimated work
		setRender({});
		modalActions.setContainerRef(containerRef);
	}, []);

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Walless Documentation</title>
			</Head>
			<View ref={containerRef}>
				<Component {...pageProps} />
			</View>
			<ModalManager />
		</>
	);
};

export default App;
