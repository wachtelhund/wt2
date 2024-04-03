import numpy as np
from pandas import read_csv
from api.model.requests import PaginatedRequest

class DataReader():
    def __init__(self, path_csv_file: str):
        self.data = None
        self.path_csv_file = path_csv_file
        self.load_data()
        self.clean_data()

    def load_data(self):
        self.data = read_csv(self.path_csv_file)

    def clean_data(self):
        self.data = self.data.replace([np.nan, np.inf, -np.inf], None)

    def get_entries(self, page: int, page_size: int):
        start = (page - 1) * page_size
        end = start + page_size
        return self.data.iloc[start:end].to_dict(orient="records")
    
    def get_all_entries(self):
        return self.data.to_dict(orient="records")

