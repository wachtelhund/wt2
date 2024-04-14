from api.model.client_error import ClientError
from api.model.data_reader import DataReader
from api.model.requests import PaginatedRequest

class StoreController:
    def __init__(self, features_data_reader: DataReader, store_data_reader: DataReader):
        self.features_data_reader = features_data_reader
        self.store_data_reader = store_data_reader
        self.ranged_data = DataReader()
        self.is_ranged_request = False
    
    def get_entries(self, query: PaginatedRequest):
        if query.to_date or query.from_date:
            self.is_ranged_request = True
            try:
                new_data = self.features_data_reader.get_potential_date_range("date", query.from_date, query.to_date)
                self.ranged_data.set_data(new_data)
                if self.ranged_data.get_count() == 0:
                    return {"stores": [], "has_next": False, "count": 0}
            except Exception as e:
                print(f"Error: {str(e)}")
                raise ClientError(e, 400, "Invalid date range.")
        else:
            self.is_ranged_request = False
            self.ranged_data = DataReader()

        data_set = self.ranged_data if self.is_ranged_request else self.features_data_reader

        if query.filter_by and query.filter_value:
            try:
                filtered_data = data_set.get_matching_entries(query.filter_by, query.filter_value, query.page, query.page_size)
                for entry in filtered_data:
                    store_data_list = self.store_data_reader.get_matching_entries("store", entry["store"], query.page, query.page_size)
                    if store_data_list:
                        entry["store_data"] = store_data_list[0]
                    else:
                        entry["store_data"] = []
                has_next = len(data_set.get_matching_entries(query.filter_by, query.filter_value, query.page + 1, query.page_size)) > 0
            except Exception as e:
                print(f"Error: {str(e)}")
                raise ClientError(e, 400, "Invalid filter value.")
        else:
            try:
                filtered_data = data_set.get_entries(query.page, query.page_size)
                for entry in filtered_data:
                    store_data_list = self.store_data_reader.get_matching_entries("store", entry["store"])
                    if store_data_list:
                        entry["store_data"] = store_data_list[0]
                    else:
                        entry["store_data"] = []
                has_next = len(data_set.get_entries(query.page + 1, query.page_size)) > 0
            except Exception as e:
                print(f"Error: {str(e)}")
                raise ClientError(e, 400, "Invalid page or page size.")
        return {"stores": filtered_data, "has_next": has_next, "count": data_set.get_count(query.filter_by, query.filter_value)}
    
    def get_ids(self):
        return self.features_data_reader.get_unique_values("store")
    
    def get_matching_entries(self, store_id: str):
        try:
            return self.features_data_reader.get_matching_entries("store", store_id)
        except Exception as e:
            print(f"Error: {str(e)}")
            raise ClientError(e, 400, "Invalid store ID.")
    
