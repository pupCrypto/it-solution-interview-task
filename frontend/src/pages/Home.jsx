import React from 'react';
import Pie from '../components/Pie';
import Table from '../components/Table';
import NewRecordModal from '../components/NewRecordModal';
import { Button, Flex, Space } from 'antd';

export default function Home() {
	const [open, setOpen] = React.useState(false);

	const onClose = () => {
		setOpen(false);
	}
	const onOk = () => {
		setOpen(false);
	}

	return (
		<Space direction='vertical' size='large' style={{ width: '100%', padding: '20px' }}>
			<Button type='primary' onClick={() => setOpen(true)}>Новая запись</Button>
			<Flex justify='center'>
				<Pie/>
			</Flex>
			<Table/>
			<NewRecordModal open={open} onClose={onClose} onOk={onOk}/>
		</Space>
	);
}