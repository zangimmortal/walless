import type { BootstrapResult } from '@walless/app';
import { appState } from '@walless/app';
import { PopupType } from '@walless/messaging';
import { initializeLiveState } from 'state/live';
import { loadRemoteConfig } from 'utils/firebase';
import { router } from 'utils/routing';

export const bootstrap = async (): Promise<BootstrapResult> => {
	await initializeLiveState();
	appState.remoteConfig = loadRemoteConfig();

	return appState;
};

export const launchApp = async ({
	profile,
	config,
}: BootstrapResult): Promise<void> => {
	const url = window.location.hash;
	const path = url.slice(1);
	const popupList = Object.values(PopupType);
	const isSdkPopup = popupList.some((popup) => path.includes(popup));

	if (profile?.email) {
		if (isSdkPopup) {
			await router.navigate(path);
		} else {
			await router.navigate(config?.latestLocation ?? '/');
		}
	} else {
		await router.navigate('/invitation');
	}

	appState.loading = false;
};
