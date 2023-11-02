import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { appState } from '@walless/engine';
import { modalActions, ModalManager, themeState } from '@walless/gui';
import Sidebar, { sidebarWidth } from 'components/DrawerNavigation/Sidebar';
import SplashScreen from 'screens/Splash';
import { useSnapshot } from 'utils/hooks';
import type { RootParamList } from 'utils/navigation';
import { linking, navigationRef, screenOptions } from 'utils/navigation';

import AuthenticationStack from './Authentication';
import DashboardStack from './Dashboard';

const Stack = createStackNavigator<RootParamList>();
const Drawer = createDrawerNavigator();

export const AppStack = () => {
	const modalContainerRef = useRef<View>(null);
	const theme = useSnapshot(themeState);
	const { profile } = useSnapshot(appState);

	const isLoggedIn = !!profile.id;

	useEffect(() => {
		modalActions.setContainerRef(modalContainerRef);
	}, []);

	return (
		<View style={styles.container} ref={modalContainerRef}>
			<NavigationContainer ref={navigationRef} linking={linking} theme={theme}>
				{isLoggedIn ? (
					<Drawer.Navigator
						drawerContent={Sidebar}
						screenOptions={{
							headerShown: false,
							drawerStyle: {
								width: sidebarWidth,
								backgroundColor: '#131C24',
							},
							overlayColor: 'transparent',
						}}
						backBehavior="order"
					>
						<Drawer.Screen name="Dashboard" component={DashboardStack} />
					</Drawer.Navigator>
				) : (
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
					</Stack.Navigator>
				)}
			</NavigationContainer>
			<ModalManager />
		</View>
	);
};

export default AppStack;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
