from fastapi import APIRouter
from pydantic import BaseModel
from app.services.google_drive import drive_service

router = APIRouter(prefix="/sync")

class SyncPayload(BaseModel):
    folder_id: str

@router.post("/drive")
async def sync_drive(payload: SyncPayload):
    return await drive_service.sync_folder_structure(payload.folder_id)
