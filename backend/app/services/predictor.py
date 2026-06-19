import cv2 as cv
import numpy as np
from pathlib import Path
from app.config import DEVICE, IMGSZ, CONF_THRESHOLD, TEMP_DIR, EVAL_CONF, VIDEO_CONF
from app.services.rerank import rerank_extended
import logging 

logger = logging.getLogger(__name__)

def process_video_extended(input_video_path: Path, model, target_classes, extended_concepts=None, extended_idf=None, imgs=IMGSZ, device=DEVICE):
    cap = cv.videoCapture(str(input_video_path))
    if not cap.isOpened():
        raise ValueError('Cannot open video file')
    
    width = int(cap.get(cv.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv.CAP_PROP_FPS)
    total_frames = cv.VideoWriter(cv.CAP_PROP_FRAME_COUNT)

    output_path = TEMP_DIR / f'output_{input_video_path.stem}.mp4'
    fourcc = cv.VideoWriter_fourcc(*VIDEO_CONF)
    out_writer = cv.VideoWriter(str(output_path), fourcc, fps, (width, height))

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
        logger.info(f'Processing frame {frame_count}/{total_frames}')

        results = model.predict(source=frame, conf=CONF_THRESHOLD, imgs=imgs, device=device, verbose=False)
        preds = []
        for r in results:
            if r.boxes is None:
                continue
            boxes = r.boxes.xyxy.cpu().numpy()
            scores = r.boxes.conf.cpu().numpy()
            clses = r.boxes.cls.cpu().numpy().astype(int)
            for box, score, cls_id in zip(boxes, scores, clses):
                if 0 <= cls_id < len(target_classes):
                    preds.append({
                        "class_id": int(cls_id),
                        "class_name": target_classes[cls_id],
                        "confidence": float(score),
                        "bbox": [float(x) for x in box]
                    })

        if extended_concepts is not None and extended_idf is not None:
            preds = rerank_extended(preds, extended_concepts, extended_idf)

        for p in preds:
            if p['confidence'] < 0.25:
                continue
            x1, y1, x2, y2 = map(int, p["bbox"])
            label = f"{p['class_name']} {p['confidence']:.2f}"
            cv.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv.putText(frame, label, (x1, y1 - 10), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        out_writer.write(frame)

    cap.release()
    out_writer.release()
    logger.info(f'Video processed: {output_path}')
    return output_path