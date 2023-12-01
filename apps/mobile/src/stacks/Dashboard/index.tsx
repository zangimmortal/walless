import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from 'stacks/Home';
import SettingStack from 'stacks/Setting';
import { useNotificationPermissionRequest } from 'utils/hooks';
import type { DashboardParamList } from 'utils/navigation';

import DrawerStack from '../Drawer';

import TabBar from './TabBar';

const Tab = createBottomTabNavigator<DashboardParamList>();

export const DashboardStack = () => {
	useNotificationPermissionRequest();

	const screenOptions: BottomTabNavigationOptions = {
		headerShown: false,
	};

	return (
		<Tab.Navigator
			screenOptions={screenOptions}
			tabBar={(props) => <TabBar tabProps={props} />}
		>
			<Tab.Screen name="Explore" component={DrawerStack} />
			<Tab.Screen name="Home" component={HomeStack} />
			<Tab.Screen name="Setting" component={SettingStack} />
		</Tab.Navigator>
	);
};

export default DashboardStack;
