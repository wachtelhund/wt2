from pathlib import Path
from fastapi import APIRouter, Depends

from api.controllers.store_controller import StoreController
from api.model.requests import PaginatedRequest
from api.model.data_reader import DataReader

store_features_path = Path(__file__).parent.parent / "data" / "features.csv"
data_reader = DataReader(store_features_path)

router = APIRouter(
    prefix="/store",
    tags=["stores"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def get_entries(pagination: PaginatedRequest = Depends()):
    return {"stores": StoreController(data_reader).get_entries(pagination.page, pagination.page_size)}