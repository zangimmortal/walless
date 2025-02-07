import type { FC } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@walless/gui';
import { ChevronLeft } from '@walless/icons';

interface Props {
	onBack?: () => void;
}

const Title: FC<Props> = ({ onBack }) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.button} onPress={onBack}>
				<ChevronLeft size={18} />
			</TouchableOpacity>

			<Text style={styles.text}>Settings</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
	},
	button: {
		width: 24,
		height: 24,
		padding: 0,
		borderRadius: 100,
		backgroundColor: '#25313D',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 20,
		color: 'white',
	},
});

export default Title;
