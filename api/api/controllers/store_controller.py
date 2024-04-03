from api.model.data_reader import DataReader
from api.model.requests import PaginatedRequest

class StoreController:
    def __init__(self, data_reader: DataReader):
        self.data_reader = data_reader
    
    def get_entries(self, page: int, page_size: int):
        return self.data_reader.get_entries(page, page_size)