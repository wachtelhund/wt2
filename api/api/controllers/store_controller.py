from api.model.data_reader import DataReader
from api.model.requests import PaginatedRequest

class StoreController:
    def __init__(self, features_data_reader: DataReader, store_data_reader: DataReader):
        self.features_data_reader = features_data_reader
        self.store_data_reader = store_data_reader
    
    def get_entries(self, query: PaginatedRequest):
        if query.filter_by and query.filter_value:
            filtered_data = self.features_data_reader.get_matching_entries(query.filter_by, query.filter_value, query.page, query.page_size)
            for entry in filtered_data:
                store_data_list = self.store_data_reader.get_matching_entries("store", entry["store"], query.page, query.page_size)
                if store_data_list:
                    entry["store_data"] = store_data_list[0]
                else:
                    entry["store_data"] = []
            has_next = len(self.features_data_reader.get_matching_entries(query.filter_by, query.filter_value, query.page + 1, query.page_size)) > 0
        else:
            filtered_data = self.features_data_reader.get_entries(query.page, query.page_size)
            for entry in filtered_data:
                store_data_list = self.store_data_reader.get_matching_entries("store", entry["store"], query.page, query.page_size)
                if store_data_list:
                    entry["store_data"] = store_data_list[0]
                else:
                    entry["store_data"] = []
            has_next = len(self.features_data_reader.get_entries(query.page + 1, query.page_size)) > 0
        if query.sort_by:
            filtered_data = sorted(filtered_data, key=lambda x: x[query.sort_by], reverse=query.sort_desc)
        return {"stores": filtered_data, "has_next": has_next, "count": self.features_data_reader.get_count(query.filter_by, query.filter_value)}
    
    def get_ids(self):
        return self.features_data_reader.get_unique_values("store")
    
    def get_matching_entries(self, store_id: str):
        return self.features_data_reader.get_matching_entries("store", store_id)
    
