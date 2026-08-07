import cv2 as cv
import logging
import subprocess
from pathlib import Path

from app.config import (
    TEMP_DIR,
    VIDEO_CONF,
    CONF_THRESHOLD,
    IMGSZ,
)

logger = logging.getLogger(__name__)

class VideoService:

    def __init__(self, detector, kg_service, clip_service, fusion_service, nms_service):
        self.detector = detector
        self.kg = kg_service
        self.clip = clip_service
        self.fusion = fusion_service
        self.nms = nms_service

        self.prompt_map, self.all_prompts = (
            self.kg.get_prompt_map()
        )

        self.clip.build_text_features(
            self.all_prompts
        )

    def process_video(self, input_video: Path, conf=CONF_THRESHOLD, imgsz=IMGSZ ):
        cap = cv.VideoCapture(str(input_video))

        if not cap.isOpened():
            raise ValueError("Cannot open video.")

        width = int(cap.get(cv.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv.CAP_PROP_FPS) or 25
        total_frames = int(cap.get(cv.CAP_PROP_FRAME_COUNT))

        output_path = (TEMP_DIR / f"output_{input_video.stem}.mp4")

        writer = cv.VideoWriter(
            str(output_path),
            cv.VideoWriter_fourcc(*VIDEO_CONF),
            fps,
            (width, height)
        )

        frame_idx = 0
        while True:
            ret, frame = cap.read()

            if not ret:
                break

            frame_idx += 1

            if frame_idx % 30 == 0:
                logger.info(
                    f"Processing frame "
                    f"{frame_idx}/{total_frames}"
                )
            #Bước 1
            preds = self.detector.predict(
                frame,
                conf=conf,
                imgsz=imgsz,
            )
            #Bước 2,3
            prompt_scores = (
                self.clip.calculate_scene_score(
                    frame
                )
            )

            class_prior = (
                self.kg.calculate_class_prior(
                    prompt_scores,
                    self.prompt_map,
                )
            )

            #Bước 4
            preds = self.fusion.rerank(
                preds,
                class_prior,
            )

            #Bước 5
            preds = self.nms.apply(preds)

            self.draw_predictions(
                frame,
                preds,
            )

            writer.write(frame)

        cap.release()
        writer.release()

        output_path = self.make_browser_playable(
            output_path,
            fps,
        )

        logger.info(
            f"Video saved: {output_path}"
        )

        return output_path

    @staticmethod
    def draw_predictions(frame, preds, conf_thr=0.25):
        for pred in preds:
            if pred["conf"] < conf_thr:
                continue

            x1, y1, x2, y2 = map(int, pred["bbox"])

            label = (f"{pred['class_name']} " f"{pred['conf']:.2f}")

            cv.rectangle( frame, (x1, y1), (x2, y2), (0, 255, 0), 2 )

            cv.putText( frame, label, (x1, y1 - 5), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2 )

    @staticmethod
    def make_browser_playable( output_path: Path, fps: float ):
        playable_path = output_path.with_name(f"{output_path.stem}_playable.mp4")

        cmd = [
            "ffmpeg",
            "-y",
            "-i",
            str(output_path),
            "-an",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(playable_path),
        ]

        if fps:
            cmd[5:5] = [
                "-r",
                str(fps),
            ]

        try:
            subprocess.run( cmd, check=True, capture_output=True )

            output_path.unlink(
                missing_ok=True,
            )

            playable_path.rename(
                output_path,
            )

        except Exception as e:
            logger.warning(e)
        return output_path