from ultralytics import YOLOE
from app.config import YOLOE_PATH, TARGET_CLASSES

_yoloe_model = None

def load_yoloe(target_classes=None):
    global _yoloe_model
    if _yoloe_model is None:
        _yoloe_model = YOLOE(YOLOE_PATH)
        if target_classes is None:
            target_classes = TARGET_CLASSES
        prompts = [c.replace("_", " ") for c in target_classes]
        try:
            _yoloe_model.set_classes(prompts, _yoloe_model.get_text_pe(prompts))
        except:
            try:
                _yoloe_model.set_classes(prompts)
            except:
                _yoloe_model.set_classes([c.replace("_", " ") for c in target_classes])
    return _yoloe_model