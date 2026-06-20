from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import detect_video
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="YOLOE Video Detection API", version="1.0")

# CORS - allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detect_video.router, prefix="/api/v1", tags=["video"])

@app.on_event("startup")
async def startup():
    detect_video.init()
    logging.info("Models and KG loaded.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)