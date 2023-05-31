import { type FC, Fragment } from 'react';
import { StyleSheet } from 'react-native';
import { Anchor, View } from '@walless/gui';
import { type DocsTree } from 'utils/types';

interface Props {
	nodes: DocsTree[];
	params: string[];
}

export const SideNavigation: FC<Props> = ({ nodes, params }) => {
	const renderNode = (node: DocsTree, level = 0) => {
		return (
			<Fragment>
				<Anchor
					key={node.path}
					title={node.name}
					titleStyle={{
						...styles[`lvl${level + 1}` as keyof typeof styles],
						marginLeft: 12 * level,
						marginBottom: 10,
					}}
					href={node.path}
					disabled={!!node.children}
					target="_self"
				/>

				{node.children &&
					node.children.map((childNode: DocsTree) =>
						renderNode(childNode, level + 1),
					)}
			</Fragment>
		);
	};

	console.log(params);

	return (
		<View style={styles.container}>
			{nodes.map((node) => renderNode(node))}
		</View>
	);
};

export default SideNavigation;

const styles = StyleSheet.create({
	container: {
		minWidth: 200,
	},
	lvl1: {
		textTransform: 'uppercase',
		fontSize: 15,
		fontWeight: '500',
		color: '#FFF',
	},
	lvl2: {
		color: '#566674',
	},
});
