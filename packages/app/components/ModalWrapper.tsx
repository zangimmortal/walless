import type { FC, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@walless/gui';

interface Props {
	children: ReactNode;
}

const ModalWrapper: FC<Props> = ({ children }) => {
	return <View style={styles.container}>{children}</View>;
};

export default ModalWrapper;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#141B21',
		justifyContent: 'space-between',
		gap: 24,
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		paddingVertical: 28,
		paddingHorizontal: 28,
	},
});
