class ClientError(BaseException):
    def __init__(self, error, status_code=400, client_message="There was an error processing your request. Please try again later."):
        self.error = error
        self.status_code = status_code
        self.client_message = client_message

    def to_dict(self):
        return {
            'error': self.error,
            'status_code': self.status_code,
            'client_message': self.client_message
        }