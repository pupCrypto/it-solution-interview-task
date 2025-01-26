import { Table as AntdTable, ConfigProvider } from 'antd';

export default function Table() {
    const columns = [
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Категория',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Подкатегория',
            dataIndex: 'subcategory',
            key: 'subcategory',
        },
        {
            title: 'Сумма',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Комментарий',
            dataIndex: 'comment',
            key: 'comment',
        }
    ];
    return (
        <ConfigProvider renderEmpty={() => <div>Нет записей</div>}>
            <AntdTable dataSource={[]} columns={columns} />
        </ConfigProvider>
    );
}