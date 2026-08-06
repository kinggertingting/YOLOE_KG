import json
import numpy as np
from app.config import KG_PATH, USEFUL_RELATIONS

class KG_Service:

    def __init__(self, kg_path=KG_PATH, useful_relations=USEFUL_RELATIONS):
        self.kg_path = kg_path
        self.useful_relations = set(useful_relations) if not isinstance(useful_relations, set) else useful_relations
        self.df = None               
        self.class_concepts = None   

    @staticmethod
    def normalize_name(x):
        return str(x).lower().replace("_", " ").replace("-", " ").strip()

    @staticmethod
    def clean_concept_uri(x):
        x = str(x).lower().strip()
        for w in ["a ", "an ", "the "]:
            x = x.replace(w, "")
        return KG_Service.normalize_name(x)

    @staticmethod
    def clean_relation(x):
        mapping = {
            "AtLocation": "atlocation",
            "IsA": "isa"
        }
        return mapping.get(x, x.lower().strip())

    @staticmethod
    def is_noisy_concept(text, max_words=5):
        t = KG_Service.normalize_name(text)
        return len(t) <= 1 or '/' in t or len(t.split()) > max_words

    def load(self):

        with open(self.kg_path, "r", encoding="utf-8") as f:
            kg = json.load(f)
        graph = {}
        total_triples = 0
        for cls, relations in kg.items():
            cls = KG_Service.normalize_name(cls)
            graph[cls] = {}
            for relation, objects in relations.items():
                relation = KG_Service.clean_relation(relation)
                if relation not in self.useful_relations:
                    continue
                concepts = { KG_Service.clean_concept_uri(obj) for obj in objects if not KG_Service.is_noisy_concept(obj) }
                graph[cls][relation] = concepts
                total_triples += len(concepts)

        print(f"Loaded {total_triples} triples from KG JSON")
        return graph

    def build_class_concepts(self, target_classes, graph, top_k=30):
        class_concepts = {}

        for cls in target_classes:
            cls_clean = KG_Service.normalize_name(cls)
            relations = graph.get(cls_clean, {})

            class_concepts[cls] = {}

            for relation, concepts in relations.items():
                class_concepts[cls][relation] = set(list(concepts)[:top_k])

        self.class_concepts = class_concepts
        return class_concepts

    def get_prompt_map(self):
        if self.class_concepts is None:
            raise ValueError("Lỗi chưa có CLASS_CONCEPTS")

        prompt_map = {}
        all_prompts = []
        
        for cls, rel_dict in self.class_concepts.items():
            prompts = []
            
            for concept in rel_dict.get('isa', set()):
                prompt = f"a photo of a {concept}"
                prompts.append(prompt)
                all_prompts.append(prompt)
            
            for concept in rel_dict.get('atlocation', set()):
                prompt = f"a photo of a {cls} in a {concept}"
                prompts.append(prompt)
                all_prompts.append(prompt)
            
            prompt_map[cls] = prompts
            
        return prompt_map, all_prompts
    
    def calculate_class_prior(self, prompt_scores, prompt_map):
        class_prior = {}
        for cls, prompts in prompt_map.items():
            if len(prompts) == 0:
                class_prior[cls] = 0.0
                continue

            scores = [
                prompt_scores.get(p, 0.0)
                for p in prompts
            ]
            class_prior[cls] = float(sum(scores) / len(prompts))

        values = np.array(list(class_prior.values()))
        if (len(values) > 1 and values.max() > values.min()):
            mn = values.min()
            mx = values.max()
            for cls in class_prior:
                class_prior[cls] = (class_prior[cls] - mn) / (mx - mn + 1e-8)
        return class_prior