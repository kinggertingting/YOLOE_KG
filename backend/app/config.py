import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

#Model paths
MODEL_DIR = BASE_DIR / "models"
YOLOE_PATH = MODEL_DIR / "yoloe-26m-seg.pt"
CLIP_MODEL_NAME = os.getenv("CLIP_MODEL_NAME", "openai/clip-vit-base-patch32")

#Data paths
DATA_DIR = BASE_DIR / "data"
KG_PATH = DATA_DIR / "KG.json"

#Params
DEVICE = os.getenv("DEVICE", "0")
if DEVICE != "cpu":
    DEVICE = int(DEVICE)
IMGSZ = int(os.getenv("IMGSZ", 640))
CONF_THRESHOLD = float(os.getenv("CONF_THRESHOLD", 0.03))
EVAL_CONF = 0.25
IOU_THR = 0.50

#Alpha
ALPHA=0.2
LOW_CONF_THR=0.25

#Relation filtering
DEFAULT_RELATIONS = "isa,atlocation"
USEFUL_RELATIONS = set(os.getenv("USEFUL_RELATIONS", DEFAULT_RELATIONS).split(","))

VIDEO_CONF = os.getenv("VIDEO_CODEC", "mp4v")
PUBLIC_BASE_URL = os.getenv("PUBLIC_BASE_URL", "").rstrip("/")

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
