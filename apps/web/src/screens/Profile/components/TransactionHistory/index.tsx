import { StyleSheet } from 'react-native';
import { Button, Text, View } from '@walless/gui';
import { useHistory } from 'utils/hooks';
import { router } from 'utils/routing';

import HistoryItem from './HistoryItem';

const TransactionHistory = () => {
	const history = useHistory();

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>History</Text>
				<Button
					style={styles.button}
					onPress={() => router.navigate('/history')}
				>
					<Text>See All</Text>
				</Button>
			</View>
			{history.length === 0 ? (
				<Text>You haven&apos;t had any transaction yet</Text>
			) : (
				<View style={styles.transactionsContainer}>
					{history.slice(0, 3).map((transaction) => (
						<HistoryItem key={transaction.signature} {...transaction} />
					))}
				</View>
			)}
		</View>
	);
};

export default TransactionHistory;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		gap: 16,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	title: {
		fontSize: 20,
		color: '#ffffff',
	},
	transactionsContainer: {
		gap: 8,
	},
	button: {
		paddingHorizontal: 8,
		paddingVertical: 8,
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#566674',
	},
});
