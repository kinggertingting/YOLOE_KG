FROM pytorch/pytorch:2.6.0-cuda12.4-cudnn9-runtime

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    DEVICE=0 \
    IMGSZ=640 \
    CONF_THRESHOLD=0.03 \
    TARGET_CLASSES="person,rider,car,bus,truck,bike,motor,traffic light,traffic sign,train,pedestrian,cyclist,van,road,lane,crosswalk,intersection,vehicle,parking lot,railway,bridge,barrier,tree,animal"

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev \
    ffmpeg curl git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel \
    && pip install -r requirements.txt \
    && pip install --no-cache-dir transformers

COPY app/ app/
COPY data/ data/

RUN mkdir -p /app/models /app/temp \
    && python -c "from ultralytics import YOLOE; import shutil; from pathlib import Path; model = YOLOE('yoloe-26m-seg.pt'); dest = Path('/app/models/yoloe-26m-seg.pt'); dest.parent.mkdir(parents=True, exist_ok=True); shutil.copy(model.ckpt_path, dest); import os; print(f'Model at {dest}, size: {os.path.getsize(dest) / 1024 / 1024:.1f} MB')"

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -fsS http://localhost:8000/docs || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
