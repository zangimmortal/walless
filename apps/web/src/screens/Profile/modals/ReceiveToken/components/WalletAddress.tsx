import { FC } from 'react';
import { Copy } from '@walless/icons';
import { Button, Image, Stack, Text } from '@walless/ui';

interface Props {
	network: string;
	networkIcon: string;
	address: string;
}

const WalletAddress: FC<Props> = ({ network, networkIcon, address }) => {
	return (
		<Button
			flexDirection="row"
			justifyContent="space-between"
			alignItems="center"
			backgroundColor="#0E141A"
			width={308}
			height={48}
			borderRadius={8}
			gap={12}
			paddingHorizontal={12}
			paddingVertical={8}
			onPress={() => {
				navigator.clipboard.writeText(address);
			}}
			cursor="pointer"
		>
			<Image src={networkIcon} width={36} height={36} borderRadius={36} />

			<Stack flexGrow={1}>
				<Text fontWeight="500" color="#FFFFFF" fontSize={16}>
					{network}
				</Text>
				<Text
					fontWeight="400"
					color="#566674"
					fontSize={14}
					textOverflow="ellipsis"
					overflow="hidden"
					whiteSpace="nowrap"
					width={100}
				>
					{address}
				</Text>
			</Stack>

			<Copy color="#566674" size={24} />
		</Button>
	);
};

export default WalletAddress;
