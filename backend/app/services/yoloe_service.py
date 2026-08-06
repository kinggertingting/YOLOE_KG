import cv2

import torch
import logging
from ultralytics import YOLOE
from app.config import YOLOE_PATH, TARGET_CLASSES, DEVICE

logger = logging.getLogger(__name__)

class YOLOEDetector:

    def __init__(self, model_path=YOLOE_PATH, target_classes=TARGET_CLASSES, device=DEVICE):

        self.model_path = model_path
        self.target_classes = target_classes
        self.device = device

        self.model = None

    def load_yoloe(self):
        if self.model is not None:
            return self.model

        # CVE-2025-32434: torch.load is not safe even with weights_only=True before torch 2.6
        # Ref: https://nvd.nist.gov/vuln/detail/CVE-2025-32434
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
                "CVE-2025-32434: YOLOE model loading uses torch.load internally "
                f"and requires torch>=2.6, but the active version is {torch.__version__}. "
                "Upgrade the runtime. "
                "See: https://nvd.nist.gov/vuln/detail/CVE-2025-32434"
            )

        if torch.cuda.is_available():
            logger.info(
                f"CUDA available: {torch.cuda.get_device_name(0)}"
            )
        else:
            logger.warning("CUDA not available. Using CPU.")

        self.model = YOLOE(self.model_path)

        device_str = (
            f"cuda:{self.device}"
            if isinstance(self.device, int)
            else self.device
        )

        self.model.to(device_str)

        logger.info(f"Model loaded on {device_str}")

        self.set_classes(self.target_classes)

        return self.model

    def set_classes(self, target_classes):
        prompts = [ c.replace("_", " ") for c in target_classes]
        try:
            self.model.set_classes( prompts, self.model.get_text_pe(prompts) )
        except Exception:
            try:
                self.model.set_classes(prompts)
            except Exception:
                self.model.set_classes(target_classes)
        self.target_classes = target_classes
        logger.info(f"Loaded {len(target_classes)} classes.")

    def predict(self, image, conf=0.03, imgsz=640):
        if self.model is None:
            self.load_yoloe()

        results = self.model.predict(
            source=image,
            conf=conf,
            imgsz=imgsz,
            device=self.device,
            verbose=False,
        )
        preds = []
        for r in results:
            if r.boxes is None:
                continue

            boxes = r.boxes.xyxy.cpu().numpy()
            scores = r.boxes.conf.cpu().numpy()
            labels = r.boxes.cls.cpu().numpy().astype(int)

            for box, score, cls in zip(boxes, scores, labels):
                if cls >= len(self.target_classes):
                    continue

                preds.append(
                    {
                        "class_id": int(cls),
                        "class_name": self.target_classes[cls],
                        "conf": float(score),
                        "bbox": box.tolist(),
                    }
                )
        return preds

    def predict_video(self, video_path, conf=0.03, imgsz=640):
        cap = cv2.VideoCapture(video_path)
        all_predictions = {}
        frame_idx = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            preds = self.predict(frame, conf=conf, imgsz=imgsz)

            all_predictions[frame_idx] = preds
            frame_idx += 1
        cap.release()
        return all_predictions