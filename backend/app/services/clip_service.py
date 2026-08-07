import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import torch.nn.functional as F
from app.config import DEVICE, CLIP_MODEL_NAME


class ClipService:

    def __init__(self, model_name=None):
        self.model_name = model_name or CLIP_MODEL_NAME
        self.device = DEVICE

        self._ensure_torch_version()

        # Load model
        self.clip_model = CLIPModel.from_pretrained(self.model_name).to(self.device)
        self.clip_processor = CLIPProcessor.from_pretrained(self.model_name)

        self.clip_model.eval()

        self.text_features = None
        self.prompts = None

    def _ensure_torch_version(self):
        """
        CVE-2025-32434: torch.load is not safe even with weights_only=True before torch 2.6.
        Ref: https://nvd.nist.gov/vuln/detail/CVE-2025-32434
        """
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
                "CVE-2025-32434: CLIP requires torch>=2.6 because the current model is loaded from a PyTorch checkpoint, "
                f"but the active torch version is {torch.__version__}. "
                "Upgrade the runtime or switch to a safetensors-backed model. "
                "See: https://nvd.nist.gov/vuln/detail/CVE-2025-32434"
            )

    @torch.no_grad()
    def build_text_features(self, prompts):
        self.prompts = list(dict.fromkeys(prompts))

        text_inputs = self.clip_processor(
            text=prompts,
            return_tensors="pt",
            padding=True,
            truncation=True,
        ).to(self.device)

        outputs = self.clip_model.get_text_features(**text_inputs)

        if hasattr(outputs, 'pooler_output'):
            self.text_features = outputs.pooler_output
        else:
            self.text_features = outputs

        self.text_features = F.normalize(self.text_features, dim=-1)


    @torch.no_grad()
    def calculate_scene_score(self, image):
        if self.text_features is None:
            raise ValueError("Text features chưa được khởi tạo.")

        if not isinstance(image, Image.Image):
            image = Image.fromarray(image)

        image_inputs = self.clip_processor(
            images=image,
            return_tensors="pt",
        ).to(self.device)

        image_outputs = self.clip_model.get_image_features(**image_inputs)
   
        if hasattr(image_outputs, 'pooler_output'):
            image_features = image_outputs.pooler_output
        else:
            image_features = image_outputs

        image_features = F.normalize(image_features, dim=-1)

        similarity = (image_features @ self.text_features.T)[0]
        scores = similarity.cpu().numpy()

        return dict(zip(self.prompts, scores))