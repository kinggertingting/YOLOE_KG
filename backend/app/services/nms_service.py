import torch
import torchvision


class NMSService:

    def __init__(self, iou_threshold=0.7):
        self.iou_threshold = iou_threshold

    def apply(self, preds):

        if len(preds) == 0:
            return []

        kept_preds = []

        class_ids = sorted(
            set(p["class_id"] for p in preds)
        )

        for cls in class_ids:

            cls_preds = [
                p for p in preds
                if p["class_id"] == cls
            ]

            boxes = torch.tensor(
                [p["bbox"] for p in cls_preds],
                dtype=torch.float32,
            )

            scores = torch.tensor(
                [p["conf"] for p in cls_preds],
                dtype=torch.float32,
            )

            keep = torchvision.ops.nms(
                boxes,
                scores,
                self.iou_threshold,
            )

            for idx in keep.tolist():
                kept_preds.append(cls_preds[idx])

        return kept_preds