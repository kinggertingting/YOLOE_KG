import os
from pathlib import Path
from dotenv import load_dotenv
import torch

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Base directories
MODEL_DIR = Path(os.getenv("MODEL_DIR", str(BASE_DIR / "models")))
DATA_DIR = Path(os.getenv("DATA_DIR", str(BASE_DIR / "data")))
TEMP_DIR = Path(os.getenv("TEMP_DIR", str(BASE_DIR / "temp")))
TEMP_DIR.mkdir(parents=True, exist_ok=True)

# Model paths & names
YOLOE_PATH = Path(os.getenv("YOLOE_PATH", str(MODEL_DIR / "yoloe-26m-seg.pt")))
CLIP_MODEL_NAME = os.getenv("CLIP_MODEL_NAME", "openai/clip-vit-base-patch32")

# Knowledge Graph path
KG_PATH = Path(os.getenv("KG_PATH", str(DATA_DIR / "KG.json")))

# Device execution configuration
device_env = os.getenv("DEVICE", "auto").lower()

if device_env == "cpu":
    DEVICE = "cpu"
elif device_env == "auto":
    DEVICE = 0 if torch.cuda.is_available() else "cpu"
else:
    try:
        DEVICE = int(device_env)
    except ValueError:
        DEVICE = device_env

# Detection & Image hyperparameters
IMGSZ = int(os.getenv("IMGSZ", 640))
CONF_THRESHOLD = float(os.getenv("CONF_THRESHOLD", 0.03))
EVAL_CONF = float(os.getenv("EVAL_CONF", 0.25))
IOU_THR = float(os.getenv("IOU_THR", 0.50))

# Multi-modal fusion hyperparameters
ALPHA = float(os.getenv("ALPHA", 0.75))
LOW_CONF_THR = float(os.getenv("LOW_CONF_THR", 0.30))
IOU_NMS = float(os.getenv("IOU_NMS", 0.70))

# Knowledge Graph relation filtering
DEFAULT_RELATIONS = "isa,atlocation"
USEFUL_RELATIONS_STR = os.getenv("USEFUL_RELATIONS", DEFAULT_RELATIONS)
USEFUL_RELATIONS = set(x.strip() for x in USEFUL_RELATIONS_STR.split(",") if x.strip())

# Video rendering & API configuration
VIDEO_CONF = os.getenv("VIDEO_CODEC", "mp4v")
PUBLIC_BASE_URL = os.getenv("PUBLIC_BASE_URL", "").rstrip("/")

# Target classes list
DEFAULT_TARGET_CLASSES = (
    "person,rider,car,bus,truck,bike,motor,traffic light,traffic sign,train,"
    "pedestrian,cyclist,van,road,lane,crosswalk,intersection,vehicle,parking lot,"
    "railway,bridge,barrier,tree,animal"
)
TARGET_CLASSES_STR = os.getenv("TARGET_CLASSES", DEFAULT_TARGET_CLASSES)
TARGET_CLASSES = [x.strip() for x in TARGET_CLASSES_STR.split(",") if x.strip()]
