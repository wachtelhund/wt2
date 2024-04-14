import numpy as np
# from pandas import read_csv, DataFrame
import pandas as pd

class DataReader():
    def __init__(self, path_csv_file: str = ""):
        self.data = None
        self.path_csv_file = path_csv_file
        try:
            self.load_data()
            self.count = len(self.data)
            self.clean_data()
        except Exception as e:
            print(f"Error loading data: {str(e)}")

    def load_data(self):
        if str(self.path_csv_file).strip() == "":
            raise ValueError(f"Path to CSV file is required, please provide a path to the CSV file or set data manually using set_data method.")
        try:
            self.data = pd.read_csv(self.path_csv_file)
            self.data.columns = self.data.columns.str.strip().str.lower().str.replace(" ", "_")
        except Exception as e:
            raise ValueError("Something went wrong while loading the data. Please check the path to the CSV file.")
        
    def set_data(self, data: pd.DataFrame):
        self.data = pd.DataFrame(data)
        self.count = len(self.data)
        self.clean_data()

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
    
    def get_range(self, column: str, min_value: float, max_value: float):
        return self.data[(self.data[column] >= min_value) & (self.data[column] <= max_value)].to_dict(orient="records")
    
    def get_potential_date_range(self, column: str, from_date: str, to_date: str, format="%d-%m-%Y"):
        if column not in self.data.columns:
            raise ValueError(f"Column '{column}' not found in DataFrame.")
        self.data[column] = pd.to_datetime(self.data[column], format=format)
        if not from_date or not to_date:
            raise ValueError("From date and To date are required.")
        condition = (self.data[column] > from_date) & (self.data[column] <= to_date)
        df = self.data.loc[condition]
        return df.to_dict(orient="records")
    
    def get_unique_values(self, column: str):
        return self.data[column].unique().tolist()
    
    def get_matching_entries(self, column: str, value: str, page: int, page_size: int, from_date: str = None, to_date: str = None):
        if column not in self.data.columns:
            raise ValueError(f"Column '{column}' not found in DataFrame.")
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

