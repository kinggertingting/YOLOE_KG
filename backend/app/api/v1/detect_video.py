from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from app.services.model_loader import load_yoloe
from app.services.predictor import process_video_extended
from app.services.kg_builder import get_concept_data
from app.config import TARGET_CLASSES, TEMP_DIR
import logging
import shutil

router = APIRouter()
logger = logging.getLogger(__name__)

model=None
concepts = None


def init():
    global model, concepts
    if model is None:
        model = load_yoloe(TARGET_CLASSES)
    if concepts is None:
        concepts = get_concept_data(TARGET_CLASSES)

@router.post('/detect-video')
async def detect_video(file: UploadFile = File(...), rerank: str = None):
    init()

    temp_input = TEMP_DIR / f'upload_{file.filename}'
    try:
        with open(temp_input, 'wb') as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'Failed to save video: {e}')
    
    if temp_input.suffix.lower() not in ['.mp4', '.avi', '.mov', '.mkv']:
        temp_input.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail='Unsupported video format, only .mp4, .avi, .mov, .mkv')
    
    try:
        ext_concepts, ext_idf = concepts
        output_path = process_video_extended(input_video_path=temp_input, model=model, target_classes=TARGET_CLASSES, extended_concepts=ext_concepts, extended_idf=ext_idf)
        temp_input.unlink(missing_ok=True)

        return FileResponse(path=str(output_path), media_type='video/mp4', filename=f'detected_{file.filename}')
    except Exception as e:
        logger.error(f'Processing error: {e}')
        raise HTTPException(status_code=500, detail=str(e))
    
    