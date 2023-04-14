import { ReactNode } from 'react';
import { StackProps } from '@tamagui/core';

export type LayoutProps = StackProps & {
	theme?: 'dark' | 'light';
	children: ReactNode;
};

export const imageSources = {
	wallessIcon: {
		uri: '/img/walless-icon.png',
	},
	wallessText: {
		uri: '/img/walless-text.png',
	},
};
