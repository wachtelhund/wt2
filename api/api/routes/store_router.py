from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException

from api.model.client_error import ClientError
from api.controllers.store_controller import StoreController
from api.model.requests import PaginatedRequest
from api.model.data_reader import DataReader

store_features_path = Path(__file__).parent.parent / "data" / "Walmart.csv"
store_path = Path(__file__).parent.parent / "data" / "stores.csv"
feature_data_reader = DataReader(store_features_path)
store_data_reader = DataReader(store_path)
controller = StoreController(feature_data_reader, store_data_reader)

router = APIRouter(
    prefix="/stores",
    tags=["stores"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def get_entries(query: PaginatedRequest = Depends()):
    try:
        return controller.get_entries(query)
    except ClientError as e:
        print(f"ClientError: {e.error}")
        raise HTTPException(e.status_code, detail=e.client_message)

@router.get("/ids")
async def get_store_ids():
    return {"store_ids": controller.get_ids()}