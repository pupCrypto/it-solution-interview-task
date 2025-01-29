import React from 'react';
import Pie from '../components/Pie';
import Table from '../components/Table';
import NewRecordModal from '../components/NewRecordModal';
import { Button, Flex, Space } from 'antd';
import { useFetchRecords, useFetchTotalNumberOfRecords } from '../hooks/web';
import { fetchCategoriesStatistic, fetchRecords, fetchTotalNumberOfRecords } from '../misc';

function extractDate(datetime) {
	return datetime?.toISOString().split('T')[0];
}

function passFilter(record, filter) {
	if (filter.categories.length && !filter.categories.find(item => item.id === record.category)) return false;
	if (filter.statuses.length && !filter.statuses.find(item => item.id === record.record_status)) return false;
	if (filter.types.length && !filter.types.find(item => item.id === record.type)) return false;
	if (filter.subcategories.length && !filter.subcategories.find(item => item.id === record.subcategory)) return false;
	if (filter.dates.start && new Date(record.date) > filter.dates.start) return false;
	if (filter.dates.end && new Date(record.date) < filter.dates.end) return false;
	return true;
}

export default function Home() {
	const [statistic, setStatistic] = React.useState([]);
	const [page, setPage] = React.useState(1);
	const [open, setOpen] = React.useState(false);
	const [records, setRecords] = React.useState([]);
	const [total, setTotal] = React.useState(0);
	const [filter, setFilter] = React.useState({
		statuses: [],
		types: [],
		subcategories: [],
		categories: [],
		dates: {},
	});

	const urlfyFilter = (filter) => {
		const filters = filter.statuses.map(status => `status=${status.id}`).concat(
			filter.types.map(type => `type=${type.id}`)
		).concat(
			filter.categories.map(category => `category=${category.id}`)
		).concat(
			filter.subcategories.map(subcategory => `subcategory=${subcategory.id}`)
		);
		if (filter.dates.start) {
			filters.push(`date_start=${extractDate(filter.dates.start)}`);
		}
		if (filter.dates.end) {
			filters.push(`date_end=${extractDate(filter.dates.end)}`);
		}
		return filters.join('&');
	}

	const fetchedRecords = useFetchRecords(page - 1, urlfyFilter(filter));
	const fetchedTotal = useFetchTotalNumberOfRecords(urlfyFilter(filter));

	const onSelectStatuses = (statuses) => {
		setFilter({...filter, statuses});
	}
	const onSelectTypes = (types) => {
		setFilter({...filter, types});
	}
	const onSelectCategories = (categories) => {
		setFilter({...filter, categories});
	}
	const onSelectSubcategories = (subcategories) => {
		setFilter({...filter, subcategories});
	}
	const onDateRangeSelect = (dates) => {
		setFilter({...filter, dates});
	}
	const onClose = () => {
		setOpen(false);
	}
	const onOk = (values) => {
		setOpen(false);
		setTotal(fetchedTotal + 1);
		if (page === 1 && passFilter(values, filter)) {
			setRecords([values, ...records.slice(0, records.length - 1)]);
		}
		fetchCategoriesStatistic().then(res => setStatistic(res));
	}
	const onPageChange = (page) => {
		setPage(page);
	}
	const onDelete = (record) => {
		// setRecords(records.filter(item => item.id !== record.id));
		fetchCategoriesStatistic().then(res => setStatistic(res));
		fetchTotalNumberOfRecords(urlfyFilter(filter)).then(total => setTotal(total.total));
		fetchRecords(page - 1, urlfyFilter(filter)).then(records => setRecords(records));
	}
	const onEdit = (record) => {
		setRecords(records.map(item => item.id === record.id ? record : item));
	}

	React.useEffect(() => {
		setRecords(fetchedRecords);
	}, [fetchedRecords]);
	React.useEffect(() => {
		setTotal(fetchedTotal.total);
	}, [fetchedTotal]);
	React.useEffect(() => {
		fetchCategoriesStatistic().then(res => setStatistic(res));
	}, []);
	return (
		<Space direction='vertical' size='large' style={{ width: '100%', padding: '20px' }}>
			<Button type='primary' onClick={() => setOpen(true)}>Новая запись</Button>
			<Flex justify='center'>
				<Pie statistic={statistic} />
			</Flex>
			<Table
				records={records}
				page={page}
				onPageChange={onPageChange}
				total={total}
				onSelectStatuses={onSelectStatuses}
				onSelectTypes={onSelectTypes}
				onSelectCategories={onSelectCategories}
				onSelectSubcategories={onSelectSubcategories}
				onDateRangeSelect={onDateRangeSelect}
				onDelete={onDelete}
				onEdit={onEdit}
			/>
			<NewRecordModal open={open} onClose={onClose} onOk={onOk} />
		</Space>
	);
}