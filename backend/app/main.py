from pathlib import Path
import shutil
import uuid
import logging

import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1 import detect_video   
from app.config import DEVICE, TEMP_DIR

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="YOLOE Video Detection API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://frontend-yoloe.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detect_video.router, prefix="/api/v1", tags=["video"])

app.mount("/uploads", StaticFiles(directory=str(TEMP_DIR)), name="uploads")


def _ensure_torch_version_safe():
    """
    Global guard against CVE-2025-32434:
    torch.load is not safe even with weights_only=True before torch 2.6.
    Ref: https://nvd.nist.gov/vuln/detail/CVE-2025-32434
    """
    version_text = torch.__version__.split("+", 1)[0]
    parts = version_text.split(".")

    try:
        major = int(parts[0])
        minor = int(parts[1]) if len(parts) > 1 else 0
    except ValueError:
        major = 0
        minor = 0

    if (major, minor) < (2, 6):
        raise RuntimeError(
            "CVE-2025-32434: torch.load is not safe even with weights_only=True "
            f"in torch {torch.__version__}. "
            "This application requires torch>=2.6. "
            "Upgrade the runtime or use safetensors-backed models. "
            "See: https://nvd.nist.gov/vuln/detail/CVE-2025-32434"
        )

    logger.info("PyTorch version %s passed CVE-2025-32434 check.", torch.__version__)


@app.on_event("startup")
async def startup():
    # ── Enforce torch>=2.6 globally (CVE-2025-32434) ──
    _ensure_torch_version_safe()

    cuda_available = torch.cuda.is_available()
    device_count = torch.cuda.device_count() if cuda_available else 0
    device_name = torch.cuda.get_device_name(0) if cuda_available else "N/A"
    
    logger.info(f"PyTorch CUDA available: {cuda_available}")
    logger.info(f"CUDA device count: {device_count}")
    logger.info(f"CUDA device name: {device_name}")
    logger.info(f"DEVICE config value: {DEVICE} (type: {type(DEVICE).__name__})")

    logger.info("App startup complete. Pipeline will load lazily on first request.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)