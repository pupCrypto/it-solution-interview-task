import React from 'react';
import { Table as AntdTable, Button, ConfigProvider, Checkbox, Flex, DatePicker, Popconfirm, Modal, Form } from 'antd';
import { useFetchStatuses, useFetchTypes, useFetchCategories, useFetchSubcategories } from '../hooks/web';
import { useAntdMessage } from '../hooks/antd';
import { axios } from '../share';
import EditRecordModal from './EditRecordModal';


export default function Table({
    onPageChange,
    records,
    page,
    total,
    onSelectStatuses,
    onSelectTypes,
    onSelectCategories,
    onSelectSubcategories,
    onDateRangeSelect,
    onDelete,
    onEdit,
}) {
    const columns = [
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
            render: RenderDataBreakWord,
            filterDropdown: (<DateRangeFilterDropdown onDateRangeSelect={onDateRangeSelect} />),
        },
        {
            title: 'Статус',
            dataIndex: 'record_status',
            key: 'record_status',
            render: RenderDataBreakWord,
            filterDropdown: () => (<StatusesFilterDropdown onSelectStatuses={onSelectStatuses} />),
        },
        {
            title: 'Тип',
            dataIndex: 'record_type',
            key: 'record_type',
            render: RenderDataBreakWord,
            filterDropdown: () => (<TypesFilterDropdown onSelectTypes={onSelectTypes} />),
        },
        {
            title: 'Категория',
            dataIndex: 'category',
            key: 'category',
            render: RenderDataBreakWord,
            filterDropdown: () => (<CategoriesFilterDropdown onSelectCategories={onSelectCategories} />),
        },
        {
            title: 'Подкатегория',
            dataIndex: 'subcategory',
            key: 'subcategory',
            render: RenderDataBreakWord,
            filterDropdown: () => (<SubcategoriesFilterDropdown onSelectSubcategories={onSelectSubcategories} />),
        },
        {
            title: 'Сумма',
            dataIndex: 'amount',
            key: 'amount',
            render: RenderDataBreakWord,
        },
        {
            title: 'Комментарий',
            dataIndex: 'comment',
            key: 'comment',
            render: RenderData,
        },
        {
            title: 'Действие',
            dataIndex: 'action',
            key: 'action',
            render: (value, record) => (<Action record={record} onDelete={onInnerDelete} onEdit={onInnerEdit} />),
        }
    ];
    const messageApi = useAntdMessage();
    const [open, setOpen] = React.useState(false);
    const [recordToEdit, setRecordToEdit] = React.useState(null);
    function onInnerEdit(record) {
        setOpen(true);
        setRecordToEdit(record);
    }
    function onInnerDelete(record) {
        axios.delete(`/api/cash-flow-records/${record.id}/`)
            .then(() => {
                onDelete(record);
                messageApi.success({ content: 'Запись успешно удалена' });
            })
            .catch((e) => messageApi.error({ content: 'Не удалось удалить запись' }));
    }
    function onSave(record) {
        setOpen(false);
        onEdit(record);
    }
    function onModalClose() {
        setOpen(false);
        setRecordToEdit(null);
    }
    return (
        <ConfigProvider renderEmpty={() => <div>Нет записей</div>}>
            <AntdTable
                dataSource={records}
                columns={columns}
                pagination={{ pageSize: 10, current: page, total: total, onChange: onPageChange, position: ['bottomLeft'] }}
            />
            <EditRecordModal open={open} onClose={onModalClose} onSave={onSave} record={recordToEdit} />
        </ConfigProvider>
    );
}

function Action({record, onDelete, onEdit}) {
    return (
        <>
            <Button type='link' size='small' onClick={() => onEdit(record)}>Редактировать</Button>
            <Popconfirm title='Вы уверены?' onConfirm={() => onDelete(record)}> 
                <Button type='link' danger size='small'>Удалить</Button>
            </Popconfirm>
        </>
    );
}

function CategoriesFilterDropdown({onSelectCategories}) {
    const categories = useFetchCategories();
    const [selected, setSelected] = React.useState([]);
    
    const onSelect = (data) => {
        const news= [...selected, data];
        setSelected(news);
        onSelectCategories?.(news);
    }
    const onClear = (data) => {
        const newStatuses = selected.filter(item => item.id !== data.id);
        setSelected(newStatuses);
        onSelectCategories?.(newStatuses);
    }

    return (
        <Flex vertical gap={10} style={{ padding: 10}}>
            {categories.map(data => (
                <Checkbox
                    onChange={(e) => e.target.checked ? onSelect(data) : onClear(data)}
                    key={data.id}
                >{data.name}</Checkbox>
            ))}
        </Flex>
    );
}

function DateRangeFilterDropdown({onDateRangeSelect}) {
    const onChange = (dates) => {
        onDateRangeSelect?.({start: dates?.[0]?.$d, end: dates?.[1]?.$d});
    }
    return (
        <div style={{padding: 10}}>
            <DatePicker.RangePicker
                allowEmpty={true}
                onChange={onChange}
                placeholder={['Выберите начальную дату', 'Выберите конечную дату']}
            />
        </div>
    );
}

function SubcategoriesFilterDropdown({onSelectSubcategories}) {
    const categories = useFetchSubcategories();
    const [selected, setSelected] = React.useState([]);
    
    const onSelect = (data) => {
        const news= [...selected, data];
        setSelected(news);
        onSelectSubcategories?.(news);
    }
    const onClear = (data) => {
        const newStatuses = selected.filter(item => item.id !== data.id);
        setSelected(newStatuses);
        onSelectSubcategories?.(newStatuses);
    }

    return (
        <Flex vertical gap={10} style={{ padding: 10}}>
            {categories.map(data => (
                <Checkbox
                    onChange={(e) => e.target.checked ? onSelect(data) : onClear(data)}
                    key={data.id}
                >{data.name}</Checkbox>
            ))}
        </Flex>
    );
}

function StatusesFilterDropdown({onSelectStatuses}) {
    const statuses = useFetchStatuses();
    const [selectedStatuses, setSelectedStatuses] = React.useState([]);
    
    const onSelect = (status) => {
        const newStatuses = [...selectedStatuses, status];
        setSelectedStatuses(newStatuses);
        onSelectStatuses?.(newStatuses);
    }
    const onClear = (status) => {
        const newStatuses = selectedStatuses.filter(item => item.id !== status.id);
        setSelectedStatuses(newStatuses);
        onSelectStatuses?.(newStatuses);
    }

    return (
        <Flex vertical gap={10} style={{ padding: 10}}>
            {statuses.map(status => (
                <Checkbox
                    onChange={(e) => e.target.checked ? onSelect(status) : onClear(status)}
                    key={status.id}
                >{status.value}</Checkbox>
            ))}
        </Flex>
    );
}

function TypesFilterDropdown({onSelectTypes}) {
    const types = useFetchTypes();
    const [selected, setSelected] = React.useState([]);
    
    const onSelect = (data) => {
        const news= [...selected, data];
        setSelected(news);
        onSelectTypes?.(news);
    }
    const onClear = (data) => {
        const newStatuses = selected.filter(item => item.id !== data.id);
        setSelected(newStatuses);
        onSelectTypes?.(newStatuses);
    }

    return (
        <Flex vertical gap={10} style={{ padding: 10}}>
            {types.map(data => (
                <Checkbox
                    onChange={(e) => e.target.checked ? onSelect(data) : onClear(data)}
                    key={data.id}
                >{data.value}</Checkbox>
            ))}
        </Flex>
    );
}


function RenderDataBreakWord(text) {
    return (
        <div style={{ overflowWrap: 'break-word' }}>
            {text}
        </div>
    );
}

function RenderData(text) {
    return (
        <div style={{ overflowWrap: 'anywhere' }}>
            {text}
        </div>
    );
}