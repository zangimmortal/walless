import { CreatePasscode } from '@walless/app';
import { signInWithPasscode } from '@walless/auth';
import { logger } from '@walless/core';
import { auth } from 'utils/firebase';
import { router } from 'utils/routing';

export const CreatePasscodeScreen = () => {
	const handleInitFail = () => {
		logger.info('Something went wrong create passcode');
		router.navigate('/login', { replace: true });
	};

	const handleOnComplete = async (passcode: string) => {
		await signInWithPasscode(passcode, auth.currentUser, handleInitFail);
		router.navigate('/explorer', { replace: true });
	};

	return <CreatePasscode onComplete={handleOnComplete} />;
};

export default CreatePasscodeScreen;
