import React from 'react';
import { List, Flex, Button, Modal, Form, Input, Popconfirm, Tree } from 'antd';
import { useFetchCategoriesWithSubcategories } from '../../hooks/web';
import { useAntdMessage } from '../../hooks/antd';
import { PlusCircleOutlined, DeleteOutlined, EditOutlined, SaveOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { axios } from '../../share';


function SubTreeTitle({subcategory, onEdit, onDelete}) {
  const [name, setName] = React.useState(subcategory.name);
  const messageApi = useAntdMessage();
  const [isEdit, setIsEdit] = React.useState(false);
  const ref = React.useRef(null);
  const onSave = () => {
    if (ref.current.input.value === name) return setIsEdit(false);
    if (!ref.current.input.value) return messageApi.error({ content: 'Необходимо ввести значение' });
    onEdit(ref.current.input.value, subcategory.id)
      .then(() => {
        setIsEdit(false);
        setName(ref.current.input.value);
        messageApi.success({ content: 'Подкатегория успешно изменена' });
      })
      .catch(() => messageApi.error({ content: 'Не удалось изменить подкатегорию' }));
  }
  return (
      isEdit ?
      <Flex justify='space-between'>
        <Input size='small' defaultValue={name} style={{width: '50%'}} ref={ref} />
        <div>
          <Button size='small' type='link' onClick={onSave}>Сохранить</Button>
          <Button danger type='link' size='small' onClick={() => setIsEdit(false)}>Отменить</Button>
        </div>
      </Flex>
      :
      <Flex justify='space-between'>
        <span>{name}</span>
        <div>
          <Button size='small' type='link' onClick={() => setIsEdit(true)}>Изменить</Button>
          <Popconfirm title='Вы уверены?' onConfirm={() => onDelete(subcategory.id)} okText='Да' cancelText='Нет'>
            <Button danger type='link' size='small'>Удалить</Button>
          </Popconfirm>
        </div>
      </Flex>
  );
}

function TreeTitle({category, onPlus, onEdit, onDelete}) {
  const [name, setName] = React.useState(category.name);
  const messageApi = useAntdMessage();
  const [isEdit, setIsEdit] = React.useState(false);
  const ref = React.useRef(null);
  const onSave = () => {
    if (ref.current.input.value === name) return setIsEdit(false);
    if (!ref.current.input.value) return messageApi.error({ content: 'Необходимо ввести значение' });
    onEdit(ref.current.input.value, category.id)
      .then(() => {
        setIsEdit(false);
        setName(ref.current.input.value);
        messageApi.success({ content: 'Категория успешно изменена' });
      })
      .catch(() => messageApi.error({ content: 'Не удалось изменить категорию' }));
  }
  return (
      isEdit ?
      <Flex justify='space-between'>
        <Input size='small' defaultValue={name} style={{width: '50%'}} ref={ref} />
        <div>
          <Button size='small' type='primary' style={{marginRight: 10}} icon={<SaveOutlined />} onClick={onSave} />
          <Button danger type='primary' size='small' onClick={() => setIsEdit(false)} icon={<CloseCircleOutlined />} />
        </div>
      </Flex>
      :
      <Flex justify='space-between'>
        <span>{name}</span>
        <div>
          <Button size='small' type='primary' style={{marginRight: 10}} icon={<PlusCircleOutlined />} onClick={onPlus} />
          <Button size='small' type='primary' style={{marginRight: 10}} icon={<EditOutlined />} onClick={() => setIsEdit(true)} />
          <Popconfirm title='Вы уверены?' onConfirm={() => onDelete(category.id)} okText='Да' cancelText='Нет'>
            <Button danger type='primary' size='small' icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      </Flex>
  );
}

function CategoryTree({category, onDelete}) {
  const messageApi = useAntdMessage();
  const [subcategories, setSubcategories] = React.useState(category.subcategories);
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm();

  const onSubcategoryEdit = (value, id) => {
    return axios.put(`/api/categories/${category.id}/subcategories/${id}/`, { name: value, category: category.id });
  }

  function onSubcategoryDelete(id) { 
    axios.delete(`/api/categories/${category.id}/subcategories/${id}/`)
      .then(() => {
        messageApi.success({ content: 'Подкатегория успешно удалена' });
        setSubcategories(subcategories.filter(item => item.id !== id));
      })
      .catch(() => messageApi.error({ content: 'Не удалось удалить подкатегорию' }));
  }

  const onCategoryEdit = (value, id) => {
    return axios.put(`/api/categories/${id}/`, { name: value });
  }
  const treeData = [{
    title: (<TreeTitle category={category} onEdit={onCategoryEdit} onPlus={() => setOpen(true)} onDelete={onDelete} />),
    selectable: false,
    key: category.id,
    children: subcategories.map(sub => ({
      title: (<SubTreeTitle subcategory={sub} onEdit={onSubcategoryEdit} onDelete={onSubcategoryDelete} />),
      key: `${category.id}-${sub.id}`,
      selectable: false,
    })),
  }];
  const onCreate = () => {
    form.validateFields()
      .then(values => {
        axios.post(`/api/categories/${category.id}/subcategories/`, {name: values.name, category: category.id})
          .then((resp) => {
            setSubcategories([...subcategories, resp.data]);
            messageApi.success({ content: 'Подкатегория успешно создана' });
            form.resetFields();
            setOpen(false);
          })
          .catch(() => messageApi.error({ content: 'Не удалось создать подкатегорию' }));
      })
      .catch(() => messageApi.error({ content: 'Проверьте введенные данные' }));
  }
  return (
    <List.Item>
      <Tree
        style={{backgroundColor: '#f5f5f5'}}
        blockNode
        treeData={treeData}
      />
      <Modal
        title={`Категория: ${category.name}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={(
          <Button type="primary" onClick={onCreate}>Создать</Button>
        )}
      >
        <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 14}}>
          <Form.Item label='Название' name='name' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </List.Item>
  );
}

function CreateCategory({open, onOk, onCancel}) {
  const [form] = Form.useForm();
  const messageApi = useAntdMessage();
  const onCreate = () => {
    form.validateFields()
      .then(values => {
        axios.post('/api/categories/', values)
          .then((resp) => {
            onOk(resp.data);
          })
          .catch(() => messageApi.error({ content: 'Не удалось создать категорию' }));
      })
      .catch(() => messageApi.error({ content: 'Проверьте введенные данные' }));
  }
  const onInnerCancel = () => {
    form.resetFields();
    onCancel();
  }
  return (
    <Modal
      title="Новая категория"
      open={open}
      onCancel={onInnerCancel}
      footer={(
        <Button type="primary" onClick={onCreate}>Создать</Button>
      )}
    >
      <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 14}}>
        <Form.Item label='Название' name='name' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default function CategoriesList() {
  const [categories, setCategories] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const fetched = useFetchCategoriesWithSubcategories();
  const messageApi = useAntdMessage();

  const onDelete = (id) => {
    axios.delete(`/api/categories/${id}/`)
      .then(() => {
        messageApi.success({ content: 'Категория успешно удалена' });
        setCategories(categories.filter(item => item.id !== id));
      })
      .catch(() => messageApi.error({ content: 'Не удалось удалить категорию' }));
  }
  const onCreate = (values) => {
    setCategories([...categories, {...values, subcategories: []}]);
    setOpen(false);
  }

  React.useEffect(() => {
    setCategories(fetched);
  }, [fetched]);
  return (
    <>
    <List
      header={(
        <Flex justify='space-between'>
          <b>Категория и подкатегория</b>
          <Button size='small' type='primary' icon={<PlusCircleOutlined />} onClick={() => setOpen(true)} />
        </Flex>
      )}
      bordered
      style={{width: '100%', height: '300px', overflow: 'auto'}}
      dataSource={categories}
      renderItem={(item) => (
        <CategoryTree category={item} onDelete={onDelete} />
      )}
    />
    <CreateCategory open={open} onCancel={() => setOpen(false)} onOk={onCreate} />
    </>
    );
}