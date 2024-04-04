from typing import Optional
from pydantic import BaseModel, Field

class PaginatedRequest(BaseModel):
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(10, ge=1, le=50, description="Number of items per page")
    sort_by: Optional[str] = Field(None, description="Sort by column")
    sort_desc: Optional[bool] = Field(False, description="Sort descending")
    filter_by: Optional[str] = Field(None, description="Filter by column")
    filter_value: Optional[str] = Field(None, description="Filter by value")




    
