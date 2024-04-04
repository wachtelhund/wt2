from api.model.data_reader import DataReader
from api.model.requests import PaginatedRequest

class StoreController:
    def __init__(self, data_reader: DataReader):
        self.data_reader = data_reader
    
    def get_entries(self, query: PaginatedRequest):
        if query.filter_by and query.filter_value:
            filtered_data = self.data_reader.get_matching_entries(query.filter_by, query.filter_value, query.page, query.page_size)
        else:
            filtered_data = self.data_reader.get_entries(query.page, query.page_size)
        if query.sort_by:
            filtered_data = sorted(filtered_data, key=lambda x: x[query.sort_by], reverse=query.sort_desc)
        return filtered_data
    
    def get_ids(self):
        return self.data_reader.get_unique_values("store")
    
    def get_matching_entries(self, store_id: str):
        return self.data_reader.get_matching_entries("store", store_id)
    
