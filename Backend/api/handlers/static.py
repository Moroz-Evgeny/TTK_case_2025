import os, settings
from fastapi import APIRouter, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from api.utils.jwt import _get_current_user_from_access_token

static_router = APIRouter()

@static_router.get("/protected/{file_path:path}")
async def get_protected_file(file_path: str, user_data: dict = Depends(_get_current_user_from_access_token)):
    file_path_full = os.path.join("TTK_case_2025", "Backend", "static", "images", file_path)
    if not os.path.exists(file_path_full):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path_full)


static_router.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")


