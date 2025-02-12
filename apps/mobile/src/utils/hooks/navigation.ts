import { useRef } from 'react';
import type { NavigationState } from '@react-navigation/native';
import { modules } from '@walless/ioc';
import type { SettingDocument } from '@walless/store';
import { useDebouncedCallback } from 'use-debounce';
import { universalAnalytics } from 'utils/firebase';
import { navigationRef } from 'utils/navigation';

let lastWidgetId: string;

export const useNavigationHydrate = () => {
	const routeNameRef = useRef<string>();

	const onNavigationReady = () => {
		routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
	};

	const onNavigationStateChange = useDebouncedCallback(
		async (state: NavigationState | undefined) => {
			const nextRouteName = navigationRef.current?.getCurrentRoute()?.name;
			/* eslint-disable */
			const findDashboard = (i: any) => i.name === 'Dashboard';
			const dashboard = state?.routes.find(findDashboard)?.state;
			const childRoute = dashboard?.routes[dashboard?.index as never];
			const widget = childRoute?.params as any
			const widgetId = widget?.params?.id;
			/* eslint-enable */

			if (childRoute?.name === 'Explore' && widgetId !== lastWidgetId) {
				lastWidgetId = widgetId;
				modules.storage.upsert<SettingDocument>('settings', async (doc) => {
					doc.config = doc.config || {};
					doc.config.latestLocation = widgetId;
					return doc;
				});
			}

			if (!!nextRouteName && routeNameRef.current !== nextRouteName) {
				universalAnalytics.logScreenView(nextRouteName, nextRouteName);
				routeNameRef.current = nextRouteName;
			}
		},
		200,
	);

	return {
		onNavigationReady,
		onNavigationStateChange,
	};
};
