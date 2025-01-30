import { axios } from './share';

export async function fetchCategoriesStatistic() {
  const res = await axios.get('/api/statistics/categories/');
  return res.data;
}

export async function fetchRecords(page, filter) {
  const res = await axios.get(`/api/cash-flow-records/?page=${page}&limit=10&${filter}`);
  return res.data;
}

export async function fetchTotalNumberOfRecords(filter) {
  const res = await axios.get(`/api/cash-flow-records/total/?${filter}`);
  return res.data;
}

export function filterObject(obj, cb) {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => cb(key, value)));
}