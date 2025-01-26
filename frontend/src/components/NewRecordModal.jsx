import React from 'react';
import { Button, Modal, Form, Select, InputNumber, Input } from 'antd';
import { useFetchCategories, useFetchSubcategories } from '../hooks/web';

const { TextArea } = Input;

export default function NewRecordModal({open, onClose, onOk}) {
	const [category, setCategory] = React.useState(null);
	const [subcategory, setSubcategory] = React.useState(null);

	const categories = useFetchCategories();
	const subcategories = useFetchSubcategories(category);

	console.log(categories);
	console.log(subcategories);

	const onCategoryChange = (e) => {
		setCategory(Number.parseInt(e.key));
	}
	const onInnerClose = () => {
		setCategory(null);
		onClose();
	}
	return (
		<Modal
			title="Новая запись"
			open={open}
			onCancel={onInnerClose}
			footer={(
				<Button type="primary" onClick={onOk}>Создать</Button>
			)}
		>
			<Form
				labelCol={{
					span: 4,
				}}
				wrapperCol={{
					span: 14,
				}}
			>
				<Form.Item required label='Сумма'>
					<InputNumber min={0}/>
				</Form.Item>
				<Form.Item required label='Статус'></Form.Item>
				<Form.Item required label='Тип'></Form.Item>
				<Form.Item required label='Категория'></Form.Item>
				<Form.Item required label='Подкатегория'></Form.Item>
				<Form.Item label='Комментарий'>
					<TextArea rows={2} autoSize={{minRows: 2, maxRows: 3}} />
				</Form.Item>
			</Form>
		</Modal>
	);
}