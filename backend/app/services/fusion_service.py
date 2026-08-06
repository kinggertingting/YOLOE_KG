import numpy as np
from app.config import ALPHA, LOW_CONF_THR

class FusionService:

    def __init__(self, alpha=ALPHA, low_conf_thr=LOW_CONF_THR):
        self.alpha = alpha
        self.low_conf_thr = low_conf_thr

    def rerank(self, preds, class_prior):
        for pred in preds:
            conf = float(pred["conf"])

            prior = class_prior.get(
                pred["class_name"],
                0.0,
            )

            pred["clip_prior"] = prior
            pred["fused"] = False

            if conf >= self.low_conf_thr:
                continue

            fused = (self.alpha * conf + (1 - self.alpha) * prior)

            if fused > conf:
                pred["conf"] = min(fused, 1.0)
                pred["fused"] = True

        return preds