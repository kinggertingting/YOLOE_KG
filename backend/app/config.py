import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

#Model paths
MODEL_DIR = BASE_DIR / "models"
YOLOE_PATH = MODEL_DIR / "yoloe-26m-seg.pt"
YOLOWORLD_PATH = MODEL_DIR / "yolov8m-worldv2.pt"

#Data paths
DATA_DIR = BASE_DIR / "data"
KG_PATH = DATA_DIR / "KG.json"

#Params
DEVICE = int(os.getenv("DEVICE", 0))
IMGSZ = int(os.getenv("IMGSZ", 640))
CONF_THRESHOLD = float(os.getenv("CONF_THRESHOLD", 0.03))
EVAL_CONF = 0.25
IOU_THR = 0.50

# Reranking hyperparams
CONCEPT_RERANK_CFG = {
    "alpha": 0.5,
    "low_conf_thr": 0.4,
    "anchor_conf_thr": 0.5
}
EXTENDED_RERANK_CFG = {
    "alpha": 0.5,
    "low_conf_thr": 0.4
}