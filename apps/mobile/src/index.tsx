import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { modalActions, ModalManager, themeState } from '@walless/gui';
import SplashScreen from 'screens/Splash';
import AuthenticationStack from 'stacks/Authentication';
import DashboardStack from 'stacks/Dashboard';
import { analytics } from 'utils/firebase';
import { useNotifications, useSnapshot } from 'utils/hooks';
import type { RootParamList } from 'utils/navigation';
import { linking, navigationRef, screenOptions } from 'utils/navigation';

const Stack = createStackNavigator<RootParamList>();

export const AppStack = () => {
	const modalContainerRef = useRef<View>(null);
	const routeNameRef = useRef<string>();
	const theme = useSnapshot(themeState);

	useNotifications();
	useEffect(() => modalActions.setContainerRef(modalContainerRef), []);

	const onNavigationReady = () => {
		routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
	};

	const onNavigationStateChange = async () => {
		const previousRouteName = routeNameRef.current;
		const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

		if (previousRouteName !== currentRouteName) {
			analytics.logScreenView({
				screen_name: currentRouteName,
				screen_class: currentRouteName,
			});

			routeNameRef.current = currentRouteName;
		}
	};

	return (
		<SafeAreaProvider>
			<View style={styles.container} ref={modalContainerRef}>
				<NavigationContainer
					ref={navigationRef}
					theme={theme}
					linking={linking}
					onReady={onNavigationReady}
					onStateChange={onNavigationStateChange}
				>
					<Stack.Navigator screenOptions={screenOptions.navigator}>
						<Stack.Screen
							name="Splash"
							component={SplashScreen}
							options={screenOptions.fade}
						/>
						<Stack.Screen
							name="Authentication"
							component={AuthenticationStack}
							options={screenOptions.fade}
						/>
						<Stack.Screen
							name="Dashboard"
							component={DashboardStack}
							options={screenOptions.bottomFade}
						/>
					</Stack.Navigator>
				</NavigationContainer>
				<ModalManager />
			</View>
		</SafeAreaProvider>
	);
};

export default AppStack;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
