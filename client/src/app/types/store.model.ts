export interface Store {
    CPI: number;
    Date: string;
    Fuel_Price: number;
    MarkDown1?: number;
    MarkDown2?: number;
    MarkDown3?: number;
    MarkDown4?: number;
    MarkDown5?: number;
    Store: number;
    Temperature: number;
    Unemployment: number;
    IsHoliday: boolean;
}

export interface StoreResponse {
    stores: Store[];
}