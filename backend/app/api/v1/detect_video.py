from pathlib import Path
import shutil
import uuid
import logging

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Request,
)
from fastapi.responses import JSONResponse

from app.pipeline import get_pipeline
from app.config import (
    TEMP_DIR,
    PUBLIC_BASE_URL,
)

router = APIRouter()

logger = logging.getLogger(__name__)

@router.post("/detect-video")
async def detect_video(request: Request, file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())

    safe_name = (Path(file.filename).name.replace(" ", "_"))

    input_path = (TEMP_DIR / f"{job_id}_{safe_name}")
    try:
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Cannot save file: {e}")

    if input_path.suffix.lower() not in {".mp4", ".avi", ".mov", ".mkv"}:
        input_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="Unsupported video.")
    try:
        pipeline = get_pipeline()
        output_path = pipeline.process_video(input_path)

        input_path.unlink(missing_ok=True,)

        final_name = (f"detected_{job_id}.mp4")

        final_path = (TEMP_DIR / final_name)

        output_path.rename(final_path)

        base_url = (PUBLIC_BASE_URL or str(request.base_url).rstrip("/"))

        return JSONResponse(
            {
                "job_id": job_id,
                "video_url": f"{base_url}/uploads/{final_name}",
                "filename": final_name,
            }
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=500, detail=str(e))