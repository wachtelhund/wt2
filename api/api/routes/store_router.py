from pathlib import Path
from fastapi import APIRouter, Depends

from api.controllers.store_controller import StoreController
from api.model.requests import PaginatedRequest
from api.model.data_reader import DataReader

store_features_path = Path(__file__).parent.parent / "data" / "features.csv"
data_reader = DataReader(store_features_path)
controller = StoreController(data_reader)

router = APIRouter(
    prefix="/stores",
    tags=["stores"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def get_entries(query: PaginatedRequest = Depends()):
    return controller.get_entries(query)

@router.get("/ids")
async def get_store_ids():
    return {"store_ids": controller.get_ids()}