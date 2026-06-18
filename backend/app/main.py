from fastapi import FastAPI
from app.api.v1 import detect_video
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="YOLOE Video Detection API", version="1.0")
app.include_router(detect_video.router, prefix="/api/v1", tags=["video"])

@app.on_event("startup")
async def startup():
    detect_video.init()
    logging.info("Models and KG loaded.")