from api.model.data_reader import DataReader
from api.model.requests import PaginatedRequest

class StoreController:
    def __init__(self, data_reader: DataReader):
        self.data_reader = data_reader
    
    def get_entries(self, query: PaginatedRequest):
        if query.filter_by and query.filter_value:
            filtered_data = self.data_reader.get_matching_entries(query.filter_by, query.filter_value, query.page, query.page_size)
            has_next = len(self.data_reader.get_matching_entries(query.filter_by, query.filter_value, query.page + 1, query.page_size)) > 0
        else:
            filtered_data = self.data_reader.get_entries(query.page, query.page_size)
            has_next = len(self.data_reader.get_entries(query.page + 1, query.page_size)) > 0
        if query.sort_by:
            filtered_data = sorted(filtered_data, key=lambda x: x[query.sort_by], reverse=query.sort_desc)
        print(has_next)
        return {"stores": filtered_data, "has_next": has_next, "count": self.data_reader.get_count(query.filter_by, query.filter_value)}
    
    def get_ids(self):
        return self.data_reader.get_unique_values("store")
    
    def get_matching_entries(self, store_id: str):
        return self.data_reader.get_matching_entries("store", store_id)
    
