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

export function useFetchCategories() {
    const categories = useFetch('/api/categories/');
    return categories ? categories : [];
}

export function useFetchSubcategories(category) {
    const subcategories = useFetch(`/api/categories/${category}/subcategories/`);
    return subcategories ? subcategories : [];
}