from pydantic import BaseModel, Field

class PaginatedRequest(BaseModel):
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(10, ge=1, le=25, description="Number of items per page")