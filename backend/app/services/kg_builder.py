import json
import math
from collections import Counter, defaultdict
import pandas as pd
from app.config import KG_PATH, TARGET_CLASSES, USEFUL_RELATIONS

def normalize_name(x):
    return str(x).lower().replace("_", " ").replace("-", " ").strip()

def clean_concept_uri(x):
    x = str(x).lower().strip()
    for w in ["a ", "an ", "the "]:
        x = x.replace(w, "")
    x = x.replace(" station", "").replace(" stop", "")
    return normalize_name(x)

def clean_relation(x):
    mapping = {
        "AtLocation": "atlocation",
        "PartOf": "partof",
        "HasProperty": "hasproperty",
        "IsA": "isa"
    }
    return mapping.get(x, x.lower().strip())

def load_conceptnet_json():
    with open(KG_PATH, 'r', encoding='utf-8') as f:
        kg = json.load(f)

    rows = []
    for cls, relations in kg.items():
        cls_clean = normalize_name(cls)
        for rel_type, objects in relations.items():
            rel_clean = clean_relation(rel_type)
            if not objects:
                continue
            for obj in objects:
                obj_clean = clean_concept_uri(obj)
                rows.append({
                    "relation": rel_type,
                    "relation_clean": rel_clean,
                    "start": cls,
                    "start_clean": cls_clean,
                    "end": obj,
                    "end_clean": obj_clean
                })
    df = pd.DataFrame(rows)
    print(f"Loaded {len(df)} triples from KG JSON")
    for col in ["relation", "relation_clean", "start", "start_clean", "end", "end_clean"]:
        if col not in df.columns:
            df[col] = []
    return df

def is_noisy_concept(text, max_words=5):
    t = normalize_name(text)
    return len(t) <= 1 or '/' in t or len(t.split()) > max_words

def build_class_concepts(target_classes, df, top_k=30):
    useful = set(USEFUL_RELATIONS) if not isinstance(USEFUL_RELATIONS, set) else USEFUL_RELATIONS
    rows = df[df["relation_clean"].isin(useful)]
    
    class_concepts = {}
    for cls in target_classes:
        cls_clean = normalize_name(cls)
        candidates = rows[(rows["start_clean"] == cls_clean) | (rows["end_clean"] == cls_clean)]
        score = defaultdict(float)
        for _, r in candidates.iterrows():
            h, t = r["start_clean"], r["end_clean"]
            other = t if h == cls_clean else h
            if not is_noisy_concept(other):
                score[other] += 1.0
        concepts = sorted(score.items(), key=lambda x: x[1], reverse=True)[:top_k]
        class_concepts[cls] = {c for c, _ in concepts}
    return class_concepts

def build_idf(class_concepts):
    concept_df = Counter()
    for cls, cons in class_concepts.items():
        for c in cons:
            concept_df[c] += 1
    N = len(class_concepts)
    return {c: math.log((N + 1) / (df + 1)) + 1.0 for c, df in concept_df.items()}

_concept_data = None

def get_concept_data(target_classes=None):
    global _concept_data
    if _concept_data is not None:
        return _concept_data

    if target_classes is None:
        target_classes = TARGET_CLASSES

    df = load_conceptnet_json()
    class_concepts = build_class_concepts(target_classes, df)
    idf = build_idf(class_concepts)

    all_kg_classes = list(df["start_clean"].unique()) if not df.empty else []
    ALL_CONTEXT = sorted(set(target_classes) | set(all_kg_classes))
    extended_class_concepts = build_class_concepts(ALL_CONTEXT, df)
    extended_idf = build_idf(extended_class_concepts)

    _concept_data = (class_concepts, idf, extended_class_concepts, extended_idf)
    return _concept_data