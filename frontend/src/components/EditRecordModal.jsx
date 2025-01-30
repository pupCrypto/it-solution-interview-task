import React from 'react';
import { Button, Modal, Form, Select, InputNumber, Input } from 'antd';
import { useFetchCategories, useFetchFilteredSubcategories, useFetchStatuses, useFetchTypes } from '../hooks/web';
import { useAntdMessage } from '../hooks/antd';
import { axios } from '../share';
import { filterObject } from '../misc';

const { TextArea } = Input;

export default function EditRecordModal({open, onClose, onSave, record}) {
	const messageApi = useAntdMessage();
	const [form] = Form.useForm();
	const [category, setCategory] = React.useState(null);
	const [subcategory, setSubcategory] = React.useState(null);
	const [status, setStatus] = React.useState(null);
	const [type, setType] = React.useState(null);
	const [comment, setComment] = React.useState(null);
	const [amount, setAmount] = React.useState(null);

	const categories = useFetchCategories();
	const subcategories = useFetchFilteredSubcategories(category || categories.find(item => item.name === record?.category)?.id);
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
				const data = { amount, category, comment, record_status: status, record_type: type, subcategory };
				const filtered = filterObject(data, (key, value) => value !== null);
				axios.patch(`/api/cash-flow-records/${record?.id}/`, filtered)
					.then((resp) => {
						messageApi.success({ content: 'Запись успешно обновлена' });
						form.resetFields();
						filtered.id = resp.data.id;
						if (filtered.subcategory) filtered.subcategory = subcategories.find(item => item.id === filtered.subcategory)?.name;
						if (filtered.category) filtered.category = categories.find(item => item.id === filtered.category)?.name;
						if (filtered.record_type) filtered.record_type = types.find(item => item.id === filtered.record_type)?.value;
						if (filtered.record_status) filtered.record_status = statuses.find(item => item.id === filtered.record_status)?.value;
						onSave(filtered);
					})
					.catch((e) => {
						console.log(e);
						messageApi.error({ content: 'Не удалось обновить запись' })
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
		form.setFieldsValue({
			amount: record?.amount,
			record_status: record?.record_status,
			record_type: record?.record_type,
			category: record?.category,
			subcategory: record?.subcategory,
			comment: record?.comment,
		});
	}, [record]);
	React.useEffect(() => {
		form.setFieldsValue({ subcategory: null });
	}, [category]);
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
			>
				<Form.Item label='Сумма' name='amount' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
					<InputNumber addonAfter='₽' min={0.01} onChange={(a) => setAmount(a)} />
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
					<TextArea rows={2} maxLength={124} autoSize={{minRows: 2, maxRows: 3}} onChange={(e) => setComment(e.currentTarget.value)} />
				</Form.Item>
			</Form>
		</Modal>
	);
}