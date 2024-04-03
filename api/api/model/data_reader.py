from pandas import read_csv

class DataReader():
    def __init__(self, path_csv_file: str):
        self.data = None
        self.path_csv_file = path_csv_file
        self.load_data()

    def load_data(self):
        self.data = read_csv(self.path_csv_file)

    def get_entries(self, page: int = 1, per_page: int = 10):
        start = (page - 1) * per_page
        end = start + per_page
        return self.data.iloc[start:end].to_dict(orient="records")
    
    def get_all_entries(self):
        return self.data.to_dict(orient="records")

