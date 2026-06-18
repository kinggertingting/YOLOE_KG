from pydantic import BaseModel
from typing import Optional, List

class BBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class Detection(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    bbox: BBox

class DetectionResponse(BaseModel):
    detections: List[Detection]