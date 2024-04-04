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
    isholiday: boolean;
    [key: string]: string | number | boolean | undefined;
}

export interface StoreResponse {
    stores: Store[];
}