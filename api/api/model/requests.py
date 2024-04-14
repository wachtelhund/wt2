from typing import Optional
from fastapi import HTTPException
from pydantic import BaseModel, Field, model_validator 

class PaginatedRequest(BaseModel):
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(10, ge=1, le=50, description="Number of items per page")
    sort_by: Optional[str] = Field(None, description="Sort by column")
    sort_desc: Optional[bool] = Field(False, description="Sort descending")
    filter_by: Optional[str] = Field(None, description="Filter by column")
    filter_value: Optional[str] = Field(None, description="Filter by value")
    from_date: Optional[str] = Field(None, description="From date")
    to_date: Optional[str] = Field(None, description="To date")

    @model_validator(
        mode="before",
    )
    def validate_dates(cls, values):
        from_date = values.get("from_date")
        to_date = values.get("to_date")
        if from_date and to_date:
            if from_date > to_date:
                raise HTTPException(status_code=400, detail="From date should be less than or equal to To date.")
        if from_date and not to_date:
            raise HTTPException(status_code=400, detail="To date is required when From date is provided.")
        if to_date and not from_date:
            raise HTTPException(status_code=400, detail="From date is required when To date is provided.")
        return values
    
    @model_validator(
        mode="before",
    )
    def validate_filter(cls, values):
        filter_by = values.get("filter_by")
        filter_value = values.get("filter_value")
        if filter_by and not filter_value:
            raise HTTPException(status_code=400, detail="Filter value is required when filter by is provided.")
        return values
