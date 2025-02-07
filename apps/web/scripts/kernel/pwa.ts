import { logger } from '@walless/core';

export const configurePWA = () => {
	self.addEventListener('install', onInstall);
	self.addEventListener('activate', onActivate);
};

const onInstall = () => {
	logger.info('Service worker installed');
};

const onActivate = () => {
	logger.info('Service worker activated');
};
