from api.model.data_reader import DataReader

class StoreController:
    def __init__(self, data_reader: DataReader):
        self.data_reader = data_reader
    
    def get_entries(self, page: int = 1, per_page: int = 10):
        return self.data_reader.get_entries(page, per_page)