import React from "react";
import { axios } from "../share";

function useFetch(url) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        axios.get(url)
            .then(res => setData(res.data))
            .catch(err => console.error(err));  // TODO: need to show error for user
    }, [url]);
    return data;
}

export function useFetchCategoriesStatistic() {
    const categoriesStatistic = useFetch('/api/statistics/categories/');
    return categoriesStatistic ? categoriesStatistic : [];
}

export function useFetchTotalNumberOfRecords() {
    const totalNumberOfRecords = useFetch('/api/cash-flow-records/total/');
    return totalNumberOfRecords ? totalNumberOfRecords : 0;
}

export function useFetchCategories() {
    const categories = useFetch('/api/categories/');
    return categories ? categories : [];
}

export function useFetchSubcategories(category) {
    const subcategories = useFetch(`/api/categories/${category || -1}/subcategories/`);
    return subcategories ? subcategories : [];
}

export function useFetchStatuses() {
    const statuses = useFetch('/api/statuses/');
    return statuses ? statuses : [];
}

export function useFetchTypes() {
    const types = useFetch('/api/types/');
    return types ? types : [];
}

export function useFetchRecords(page=0) {
    const records = useFetch(`/api/cash-flow-records/?page=${page}&limit=10`);
    return records ? records : [];
}

export function useFetchCategoriesWithSubcategories() {
    const categoriesWithSubcategories = useFetch('/api/categories/subcategory/');
    return categoriesWithSubcategories ? categoriesWithSubcategories : [];
}