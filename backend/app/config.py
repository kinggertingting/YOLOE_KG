import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

#Model paths
MODEL_DIR = BASE_DIR / "models"
YOLOE_PATH = MODEL_DIR / "yoloe-26m-seg.pt"

#Data paths
DATA_DIR = BASE_DIR / "data"
KG_PATH = DATA_DIR / "KG.json"

#Params
DEVICE = os.getenv("DEVICE", "cpu")
if DEVICE != "cpu":
    DEVICE = int(DEVICE)
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

#Relation filtering
DEFAULT_RELATIONS = "isa,atlocation,hasproperty,partof"
USEFUL_RELATIONS = set(os.getenv("USEFUL_RELATIONS", DEFAULT_RELATIONS).split(","))

VIDEO_CONF = os.getenv("VIDEO_CODEC", "avc1") 

# Temp
TEMP_DIR = BASE_DIR / "temp"
TEMP_DIR.mkdir(exist_ok=True)

TARGET_CLASSES_STR = os.getenv("TARGET_CLASSES", "")
if TARGET_CLASSES_STR:
    TARGET_CLASSES = [x.strip() for x in TARGET_CLASSES_STR.split(",")]
else:
    TARGET_CLASSES = [
        'person', 'rider', 'car', 'bus', 'truck', 'bike', 'motor', 
        'traffic light', 'traffic sign', 'train', 
        'pedestrian', 'cyclist', 'van', 'road', 'lane', 
        'crosswalk', 'intersection', 'vehicle', 'parking lot', 
        'railway', 'bridge', 'barrier', 'tree', 'animal'
    ]