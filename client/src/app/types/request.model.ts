export interface PaginatedRequest {
    page: number;
    page_size: number;
    sorty_by?: string;
    sort_desc?: boolean;
    filter_by?: string;
    filter_value?: string;
    from_date?: string;
    to_date?: string;
}
