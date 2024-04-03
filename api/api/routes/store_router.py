from fastapi import APIRouter


router = APIRouter(
    prefix="/store",
    tags=["stores"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def get_entries(page: int = 1, per_page: int = 10):
    return {"page": page, "per_page": per_page}