import logging
from threading import Lock

from app.config import TARGET_CLASSES

from app.services.yoloe_service import YOLOEDetector
from app.services.kg_service import KG_Service
from app.services.clip_service import ClipService
from app.services.fusion_service import FusionService
from app.services.video_service import VideoService

logger = logging.getLogger(__name__)
_pipeline_instance = None
_pipeline_lock = Lock()


class DetectionPipeline:

    def __init__(self):

        logger.info(" Loading Detection Pipeline")

        self.detector = YOLOEDetector(
            target_classes=TARGET_CLASSES
        )

        self.detector.load_yoloe()

        self.kg = KG_Service()

        graph = self.kg.load()

        self.kg.build_class_concepts(TARGET_CLASSES, graph)

        self.clip = ClipService()

        self.prompt_map, self.all_prompts = (self.kg.get_prompt_map())

        self.clip.build_text_features(self.all_prompts)

        self.fusion = FusionService()

        self.video_service = VideoService(
            detector=self.detector,
            kg_service=self.kg,
            clip_service=self.clip,
            fusion_service=self.fusion,
        )

        logger.info("Pipeline loaded successfully.")

    def process_video(self, input_video):
        return self.video_service.process_video(input_video)


def get_pipeline():
    global _pipeline_instance

    if _pipeline_instance is None:
        with _pipeline_lock:
            if _pipeline_instance is None:
                _pipeline_instance = DetectionPipeline()

    return _pipeline_instance