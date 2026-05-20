from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.economics import calculate_unit_economics
from app.services.ai_seo import seo_service
from app.services.yml_validator import validate_yml

router = APIRouter(prefix="/tools")

class EconomicsPayload(BaseModel):
    price: float
    cost: float
    vat_rate: float
    marketplace_commission: float
    logistics_cost: float
    storage_cost: float
    marketing_cost: float

@router.post("/calculator")
def calculator(payload: EconomicsPayload):
    return calculate_unit_economics(**payload.model_dump())

class SEOPayload(BaseModel):
    text: str

@router.post("/seo-check")
async def seo_check(payload: SEOPayload):
    return await seo_service.analyze_keywords(payload.text)

class YMLPayload(BaseModel):
    content: str

@router.post("/yml-validate")
def yml_validate(payload: YMLPayload):
    return validate_yml(payload.content)
