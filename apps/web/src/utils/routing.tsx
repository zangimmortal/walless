import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import { modules } from '@walless/ioc';
import { PopupType } from '@walless/messaging';
import CreatePasscodeScreen from 'screens/CreatePasscode';
import DashboardScreen from 'screens/Dashboard';
import Collection from 'screens/Dashboard/Collection';
import EmbeddedApp from 'screens/Dashboard/Embed';
import Nft from 'screens/Dashboard/Nft';
import DeprecatedPasscodeScreen from 'screens/DeprecatedPasscode';
import ExploreScreen from 'screens/Explore';
import HistoryScreen from 'screens/HistoryScreen';
import InvitationScreen from 'screens/Invitation';
import LoginScreen from 'screens/Login';
import PasscodeScreen from 'screens/Passcode';
import ProfileScreen from 'screens/Profile';
import RecoveryScreen from 'screens/Recovery';
import RequestConnect from 'screens/Request/Connect';
import RequestLayout from 'screens/Request/Layout';
import RequestSignature from 'screens/Request/Signature';
import SettingScreen from 'screens/Setting';

const createRouter =
	BUILD_TARGET === 'extension' ? createHashRouter : createBrowserRouter;

export const router = createRouter([
	{
		path: '/',
		element: <DashboardScreen />,
		children: [
			{
				path: '/explorer',
				element: <ExploreScreen />,
			},
			{
				path: '/profile',
				element: <ProfileScreen />,
			},
			{
				path: '/history',
				element: <HistoryScreen />,
			},
			{
				path: '/setting',
				element: <SettingScreen />,
			},
			{
				path: '/:id/*',
				element: <EmbeddedApp />,
			},
			{
				path: '/collections/:id',
				element: <Collection />,
			},
			{
				path: '/nfts/:id',
				element: <Nft />,
			},
		],
	},
	{
		path: '/passcode/:feature',
		element: <PasscodeScreen />,
		loader: async ({ params }) => {
			return params;
		},
	},
	{
		path: '/login',
		element: <LoginScreen />,
	},
	{
		path: '/invitation',
		element: <InvitationScreen />,
	},
	{
		path: '/recovery',
		element: <RecoveryScreen />,
	},
	{
		path: '/create-passcode',
		element: <CreatePasscodeScreen />,
	},
	{
		path: '/deprecated-passcode',
		element: <DeprecatedPasscodeScreen />,
	},
	{
		path: `/${PopupType.REQUEST_CONNECT_POPUP}/:requestId`,
		element: <RequestConnect />,
	},
	{
		path: `/${PopupType.SIGNATURE_POPUP}/:requestId`,
		element: <RequestSignature />,
	},
	{
		path: `/${PopupType.REQUEST_INSTALL_LAYOUT_POPUP}/:requestId`,
		element: <RequestLayout />,
	},
]);

let previousPathName: string;

router.subscribe((route) => {
	const currentPathName = route.location.pathname;

	if (currentPathName !== previousPathName) {
		modules.analytics?.logEvent('screen_view', {
			firebase_screen: currentPathName,
			firebase_screen_class: currentPathName,
		});

		previousPathName = currentPathName;
	}
});
