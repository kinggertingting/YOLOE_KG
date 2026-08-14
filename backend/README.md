# 🐍 YOLOE-KG-CLIP Backend Service

FastAPI backend service responsible for multi-modal inference pipeline combining YOLOE, ConceptNet Knowledge Graph, and CLIP.

For full research architecture documentation and formulas, refer to the [Main Project README](../README.md).

## 📁 Backend Directory Overview

- `app/main.py`: FastAPI application entrypoint, CORS middleware, static file mounting, CVE guard.
- `app/pipeline.py`: DetectionPipeline singleton initialization.
- `app/services/yoloe_service.py`: YOLOE detector interface and prediction logic.
- `app/services/kg_service.py`: ConceptNet triple parsing (`isa`, `atlocation`), prompt construction, and Class Prior calculation.
- `app/services/clip_service.py`: Hugging Face CLIP vision/text encoding and scene-prompt similarity calculation.
- `app/services/fusion_service.py`: Geometric Weighted Fusion reranking algorithm implementation.
- `app/services/nms_service.py`: Non-Maximum Suppression post-processing.
- `app/services/video_service.py`: Frame-by-frame processing pipeline, annotation rendering, and FFmpeg H.264 browser video conversion.
- `data/KG.json`: Pre-processed ConceptNet relational triples.
- `models/`: Storage directory for model weight files (e.g. `yoloe-26m-seg.pt`).

## 🚀 Quick Start

```bash
# 1. Environment setup
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
pip install -r requirements.txt

# 2. Launch FastAPI backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
