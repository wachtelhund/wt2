import numpy as np
from pandas import read_csv

class DataReader():
    def __init__(self, path_csv_file: str):
        self.data = None
        self.path_csv_file = path_csv_file
        self.load_data()
        self.count = len(self.data)
        self.clean_data()

    def load_data(self):
        self.data = read_csv(self.path_csv_file)
        self.data.columns = self.data.columns.str.strip().str.lower().str.replace(" ", "_")

    def clean_data(self):
        self.data = self.data.replace([np.nan, np.inf, -np.inf], None)

    def get_entries(self, page: int, page_size: int):
        start = (page - 1) * page_size
        end = start + page_size
        return self.data.iloc[start:end].to_dict(orient="records")
    
    def get_all_entries(self):
        data = self.data.to_dict(orient="records")
        data.append({"count": self.count})
        return data
    
    def get_unique_values(self, column: str):
        return self.data[column].unique().tolist()
    
    def get_matching_entries(self, column: str, value: str, page: int, page_size: int):
        if column not in self.data.columns:
            print(f"Column '{column}' not found in DataFrame.")
            return []
        value_str = str(value)
        filtered_df = self.data[self.data[column].astype(str).str.lower() == value_str]
        filteredValue = filtered_df.to_dict(orient="records")
        start = (page - 1) * page_size
        end = start + page_size
        return filteredValue[start:end]

    def get_count(self, column: str = None, value: str = None):
        if column and value:
            return len(self.data[self.data[column].astype(str).str.lower() == value.lower()])
        return self.count

