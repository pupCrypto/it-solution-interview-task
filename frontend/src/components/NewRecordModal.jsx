import React from 'react';
import { Button, Modal, Form, Select, InputNumber, Input } from 'antd';
import { useFetchCategories, useFetchSubcategories, useFetchStatuses, useFetchTypes } from '../hooks/web';
import { useAntdMessage } from '../hooks/antd';
import { axios } from '../share';

const { TextArea } = Input;

export default function NewRecordModal({open, onClose, onOk}) {
	const messageApi = useAntdMessage();
	const [form] = Form.useForm();
	const [category, setCategory] = React.useState(null);
	const [subcategory, setSubcategory] = React.useState(null);
	const [status, setStatus] = React.useState(null);
	const [type, setType] = React.useState(null);

	const categories = useFetchCategories();
	const subcategories = useFetchSubcategories(category);
	const statuses = useFetchStatuses();
	const types = useFetchTypes();

	const onCategoryChange = (category) => {
		setCategory(category);
	}
	const onSubcategoryChange = (subcategory) => {
		setSubcategory(subcategory);
	}
	const onStatusChange = (status) => {
		setStatus(status);
	}
	const onTypeChange = (type) => {
		setType(type);
	}
	const onInnerOk = () => {
		form.validateFields()
			.then(values => {
				axios.post('/api/cash-flow-records/', values)
					.then(() => {
						messageApi.success({ content: 'Запись успешно создана' });
						onOk(values);
					})
					.catch(() => messageApi.error({ content: 'Не удалось создать запись' }));
			})
			.catch(() => messageApi.error('Проверьте введенные данные'));
		// onOk();
	}
	const onInnerClose = () => {
		form.resetFields();
		setCategory(null);
		onClose();
	}
	return (
		<Modal
			title="Новая запись"
			open={open}
			onCancel={onInnerClose}
			footer={(
				<Button type="primary" onClick={onInnerOk}>Создать</Button>
			)}
		>
			<Form
				form={form}
				labelCol={{
					span: 6,
				}}
				wrapperCol={{
					span: 14,
				}}
			>
				<Form.Item label='Сумма' name='amount' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
					<InputNumber addonAfter='₽' min={0.01}/>
				</Form.Item>
				<Form.Item label='Статус' name='record_status' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
					<Select onChange={onStatusChange} >
						{statuses.map(status => (
							<Select.Option key={status.id} value={status.id}>{status.value}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item label='Тип' name='record_type' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
					<Select onChange={onTypeChange} >
						{types.map(type => (
							<Select.Option key={type.id} value={type.id}>{type.value}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item label='Категория' name='category' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
					<Select onChange={onCategoryChange} >
						{categories.map(category => (
							<Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item label='Подкатегория' name='subcategory' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
					<Select onChange={onSubcategoryChange} >
						{subcategories.map(subcategory => (
							<Select.Option key={subcategory.id} value={subcategory.id}>{subcategory.name}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item label='Комментарий' name='comment'>
					<TextArea rows={2} maxLength={124} autoSize={{minRows: 2, maxRows: 3}} />
				</Form.Item>
			</Form>
		</Modal>
	);
}