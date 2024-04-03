from fastapi import APIRouter, FastAPI
from api.routes import store_router


class MainRouter():
    def __init__(self, api: FastAPI):
        self.router = APIRouter()
        self.api = api

    def attach_routes(self):
        self.router.include_router(store_router.router)
        self.api.include_router(self.router)
        return self.api