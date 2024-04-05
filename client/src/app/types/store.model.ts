export interface Store {
    cpi: number;
    date: string;
    fuel_price: number;
    markDown1?: number;
    markDown2?: number;
    markDown3?: number;
    markDown4?: number;
    markDown5?: number;
    store: number;
    temperature: number;
    unemployment: number;
    weekly_sales: number;
    holiday_flag: 1 | 0;
    store_data: StoreData;
    [key: string]: string | number | boolean | undefined | StoreData;
}

export interface StoreData {
    store: number;
    type: string;
    size: number;
}

export interface StoreResponse {
    stores: Store[];
    has_next: boolean;
    count: number;
}

export interface StoreIdsResponse {
    store_ids: number[];
}