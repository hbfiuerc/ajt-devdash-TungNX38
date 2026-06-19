import type {Product} from "./types";

export async function fetchJson<T>(url: string):Promise<T>{
    const respone = await fetch(url);

    if(!respone.ok){
        throw new Error(`Lỗi tải dữ liệu: ${respone.status} - ${respone.statusText}`);
    }

    const data = await respone.json();
    return data;
}

export async function getAllProducts(): Promise<Product[]>{
    return fetchJson<Product[]>("https://fakestoreapi.com/products");
}

export async function getAllCategories(): Promise<string[]> {
    return fetchJson<string[]>('https://fakestoreapi.com/products/categories');
}

export async function getProductById(id: number): Promise<Product> {
    return fetchJson<Product>(`https://fakestoreapi.com/products/${id}`);
}


