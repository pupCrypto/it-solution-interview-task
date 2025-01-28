import React from 'react';
import { List, Flex, ConfigProvider, Button, Modal, Form, Input, Popconfirm, Tree } from 'antd';
import { useFetchStatuses, useFetchTypes } from '../../hooks/web';
import { useAntdMessage } from '../../hooks/antd';
import { PlusCircleOutlined, DeleteOutlined, EditOutlined, SaveOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { axios } from '../../share';
import CategoriesList from './DirectoryCategory';


function SimpleListItem({item, onDelete, onSave}) {
  const messageApi = useAntdMessage();
  const [value, setValue] = React.useState(item.value);
  const [isEdit, setIsEdit] = React.useState(false);
  const ref = React.useRef(null);

  const onEdit = () => {
    setIsEdit(true);
  }
  const cancelEdit = () => {
    setIsEdit(false);
  }
  const onInnerSave = () => {
    if (ref.current.input.value === value) return cancelEdit();
    if (!ref.current.input.value) return messageApi.error({ content: 'Необходимо ввести значение' });
    onSave(ref.current.input.value, item.id)
      .then(() => {
        setValue(ref.current.input.value);
        setIsEdit(false);
      });
  }
  return (
    <List.Item>
      {
        isEdit ?
        <>
          <Input size='small' defaultValue={value} style={{width: '70%'}} ref={ref} />
          <Button size='small' type='primary' icon={<SaveOutlined />} onClick={onInnerSave} style={{marginLeft: 'auto'}} />
          <Button size='small' type='primary' danger icon={<CloseCircleOutlined />} style={{marginLeft: '10px'}} onClick={cancelEdit} />
        </>
        :
        <>
          <span>{value}</span>
          <Button size='small' type='primary' icon={<EditOutlined />} onClick={onEdit} style={{marginLeft: 'auto'}} />
          <Popconfirm title='Вы уверены?' onConfirm={() => onDelete(item.id)} okText='Да' cancelText='Нет'>
            <Button size='small' type='primary' danger icon={<DeleteOutlined />} style={{marginLeft: '10px'}} />
          </Popconfirm>
        </>
      }
    </List.Item>
  );
}

function TypesList() {
  const messageApi = useAntdMessage();
  const [open, setOpen] = React.useState(false);
  const [types, setTypes] = React.useState([]);
  const [form] = Form.useForm();
  const fetched = useFetchTypes();

  const onCreate = () => {
    form.validateFields()
      .then(values => {
        axios.post('/api/types/', values)
          .then((resp) => {
            messageApi.success({ content: 'Тип успешно создан' });
            setTypes([...types, resp.data]);
            setOpen(false);
          })
          .catch(() => messageApi.error({ content: 'Не удалось создать тип' }));
      })
      .catch(() => messageApi.error({ content: 'Проверьте введенные данные' }));
  }

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  }

  const onDelete = (id) => {
    axios.delete(`/api/types/${id}/`)
      .then(() => {
        messageApi.success({ content: 'Тип успешно удален' });
        setTypes(types.filter(item => item.id !== id));
      })
      .catch(() => messageApi.error({ content: 'Не удалось удалить тип' }));
  }

  const onSave = (value, id) => {
    return axios.put(`/api/types/${id}/`, { value })
      .then(() => {
        messageApi.success({ content: 'Тип успешно изменен' });
      })
      .catch(() => messageApi.error({ content: 'Не удалось изменить тип' }));
  }

  React.useEffect(() => {
    setTypes(fetched);
  }, [fetched]);
  return (
    <>
      <List
        style={{width: '50%', height: '300px', overflow: 'auto'}}
        header={(
          <Flex justify='space-between'>
            <b>Тип</b>
            <Button size='small' type='primary' icon={<PlusCircleOutlined />} onClick={() => setOpen(true)} />
          </Flex>
        )}
        dataSource={types}
        renderItem={(item) => (
          <SimpleListItem item={item} onDelete={onDelete} onSave={onSave} />
        )}
        bordered
      />
      <Modal
        title="Новый тип"
        open={open}
        onCancel={onCancel}
        footer={(
          <Button type="primary" onClick={onCreate}>Создать</Button>
        )}
      >
        <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 14}}>
          <Form.Item label='Название' name='value' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}


function StatusesList() {
  const messageApi = useAntdMessage();
  const [open, setOpen] = React.useState(false);
  const [statuses, setStatuses] = React.useState([]);
  const [form] = Form.useForm();
  const fetched = useFetchStatuses();

  const onCreate = () => {
    form.validateFields()
      .then(values => {
        axios.post('/api/statuses/', values)
          .then((resp) => {
            messageApi.success({ content: 'Статус успешно создан' });
            setStatuses([...statuses, resp.data]);
            setOpen(false);
          })
          .catch(() => messageApi.error({ content: 'Не удалось создать статус' }));
      })
      .catch(() => messageApi.error({ content: 'Проверьте введенные данные' }));
  }

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  }

  const onDelete = (id) => {
    axios.delete(`/api/statuses/${id}/`)
      .then(() => {
        messageApi.success({ content: 'Статус успешно удален' });
        setStatuses(statuses.filter(item => item.id !== id));
      })
      .catch(() => messageApi.error({ content: 'Не удалось удалить статус' }));
  }

  const onSave = (value, id) => {
    return axios.put(`/api/statuses/${id}/`, { value })
      .then(() => {
        messageApi.success({ content: 'Статус успешно изменен' });
      })
      .catch(() => messageApi.error({ content: 'Не удалось изменить статус' }));
  }

  React.useEffect(() => {
    setStatuses(fetched);
  }, [fetched]);
  return (
    <>
      <List
        style={{width: '50%', height: '300px', overflow: 'auto'}}
        header={(
          <Flex justify='space-between'>
            <b>Тип</b>
            <Button size='small' type='primary' icon={<PlusCircleOutlined />} onClick={() => setOpen(true)} />
          </Flex>
        )}
        dataSource={statuses}
        renderItem={(item) => (
          <SimpleListItem item={item} onDelete={onDelete} onSave={onSave} />
        )}
        bordered
      />
      <Modal
        title="Новый статус"
        open={open}
        onCancel={onCancel}
        footer={(
          <Button type="primary" onClick={onCreate}>Создать</Button>
        )}
      >
        <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 14}}>
          <Form.Item label='Название' name='value' rules={[{ required: true, message: '${label} обязательно для заполнения' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}


export default function Directory() {
  return (
    <ConfigProvider renderEmpty={() => <div>Нет записей</div>}>
    <Flex vertical align='center' justify='center' gap={30} style={{ width: '100%', padding: '20px'}}>
      <Flex horizontal gap={30} align='center' justify='center' style={{ width: '100%'}}>
        <TypesList />
        <StatusesList />
      </Flex>
      <CategoriesList />
    </Flex>
    </ConfigProvider>
  );
}