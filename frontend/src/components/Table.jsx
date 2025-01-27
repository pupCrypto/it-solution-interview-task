import React from 'react';
import { Table as AntdTable, ConfigProvider } from 'antd';
import { useFetchRecords, useFetchTotalNumberOfRecords } from '../hooks/web';

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

export default function Table() {
    const [page, setPage] = React.useState(1);
    const total = useFetchTotalNumberOfRecords();
    const records = useFetchRecords(page - 1);
    const columns = [
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
            render: RenderDataBreakWord,
        },
        {
            title: 'Статус',
            dataIndex: 'record_status',
            key: 'record_status',
            render: RenderDataBreakWord,
        },
        {
            title: 'Тип',
            dataIndex: 'record_type',
            key: 'record_type',
            render: RenderDataBreakWord,
        },
        {
            title: 'Категория',
            dataIndex: 'category',
            key: 'category',
            render: RenderDataBreakWord,
        },
        {
            title: 'Подкатегория',
            dataIndex: 'subcategory',
            key: 'subcategory',
            render: RenderDataBreakWord,
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
        }
    ];
    return (
        <ConfigProvider renderEmpty={() => <div>Нет записей</div>}>
            <AntdTable
                dataSource={records}
                columns={columns}
                pagination={{ pageSize: 10, current: page, total: total?.total, onChange: setPage, position: ['bottomLeft'] }}
            />
        </ConfigProvider>
    );
}