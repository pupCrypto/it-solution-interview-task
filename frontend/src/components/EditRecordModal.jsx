import React from 'react';
import { Button, Modal, Form, Select, InputNumber, Input } from 'antd';
import { useFetchCategories, useFetchFilteredSubcategories, useFetchStatuses, useFetchTypes } from '../hooks/web';
import { useAntdMessage } from '../hooks/antd';
import { axios } from '../share';

const { TextArea } = Input;

export default function EditRecordModal({open, onClose, onSave, record}) {
	const messageApi = useAntdMessage();
	const [form] = Form.useForm();
	const [category, setCategory] = React.useState(null);
	const [subcategory, setSubcategory] = React.useState(null);
	const [status, setStatus] = React.useState(null);
	const [type, setType] = React.useState(null);
	const [rrecord, setRecord] = React.useState(null);

	const categories = useFetchCategories();
	const subcategories = useFetchFilteredSubcategories(category);
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
				axios.put(`/api/cash-flow-records/${record?.id}/`, values)
					.then((resp) => {
						messageApi.success({ content: 'Запись успешно создана' });
						form.resetFields();
						onSave(resp.data);
					})
					.catch((e) => {
						console.log(e);
						messageApi.error({ content: 'Не удалось создать запись' })
					});
			})
			.catch(() => messageApi.error('Проверьте введенные данные'));
	}
	const onInnerClose = () => {
		form.resetFields();
		setCategory(null);
		onClose();
	}
	React.useEffect(() => {
		if (record) {
			setRecord(record);
		} else {
			form.resetFields();
			console.log('reseting fields');
		}
	}, [record]);
	return (
		<Modal
			title="Редактирование"
			open={open}
			onCancel={onInnerClose}
			footer={(
				<Button type="primary" onClick={onInnerOk}>Сохранить</Button>
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
				initialValues={{
					amount: rrecord?.amount,
					record_status: rrecord?.record_status,
					record_type: rrecord?.record_type,
					category: rrecord?.category,
					subcategory: rrecord?.subcategory,
					comment: rrecord?.comment,
				}}
			>
				<Form.Item label='Сумма' name='amount' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
					<InputNumber addonAfter='₽' min={0.01} />
				</Form.Item>
				<Form.Item label='Статус' name='record_status' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
					<Select
						onChange={onStatusChange}
						options={statuses.map(item => ({ label: item.value, value: item.id }))}
					/>
				</Form.Item>
				<Form.Item label='Тип' name='record_type' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
					<Select
						onChange={onTypeChange}
						options={types.map(item => ({ label: item.value, value: item.id }))}
					/>
				</Form.Item>
				<Form.Item label='Категория' name='category' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
					<Select
						onChange={onCategoryChange}
						options={categories.map(item => ({ label: item.name, value: item.id }))}
					/>
				</Form.Item>
				<Form.Item label='Подкатегория' name='subcategory' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
					<Select onChange={onSubcategoryChange}
						options={subcategories.map(item => ({ label: item.name, value: item.id }))}
					/>
				</Form.Item>
				<Form.Item label='Комментарий' name='comment'>
					<TextArea rows={2} maxLength={124} autoSize={{minRows: 2, maxRows: 3}} />
				</Form.Item>
			</Form>
		</Modal>
	);
}