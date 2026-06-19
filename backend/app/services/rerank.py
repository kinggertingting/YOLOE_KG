from collections import defaultdict
from app.config import EVAL_CONF

def extract_extended_scene(preds, class_concepts, conf_thr=EVAL_CONF):
    scene = defaultdict(float)
    for p in preds:
        if p["confidence"] < conf_thr:
            continue
        cls = p["class_name"]
        scene[cls] += p["confidence"]
        for c in class_concepts.get(cls, []):
            scene[c] += p["confidence"]
    return dict(scene)

def concept_support_extended(target, scene, class_concepts, concept_idf):
    concepts = class_concepts.get(target, [])
    if not concepts:
        return 0.0
    score, norm = 0.0, 0.0
    for c in concepts:
        idf = concept_idf.get(c, 1.0)
        norm += idf
        if c in scene:
            score += scene[c] * idf
    return score / (norm + 1e-9)

def rerank_extended(preds, class_concepts, concept_idf, alpha=0.5, low_conf_thr=0.4):
    scene = extract_extended_scene(preds, class_concepts, conf_thr=EVAL_CONF)
    out = []
    for p in preds:
        new_p = p.copy()
        if p["confidence"] > low_conf_thr:
            out.append(new_p)
            continue
        sup = concept_support_extended(p["class_name"], scene, class_concepts, concept_idf)
        new_p["confidence"] = min(0.999, p["confidence"] + alpha * sup)
        out.append(new_p)
    return out