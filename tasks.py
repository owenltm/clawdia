from datetime import date
import ollama
import numpy as np
from data.tasks import tasks

def get_embedding(text):
    return  ollama.embeddings(model='llama3.1', prompt=text)['embedding']

task_embeddings = [get_embedding(task) for task in tasks]

query = "saya menggunakan air seberapa ?"
query_embedding = get_embedding(query)

# Normalize the query vector
normalized_query = query_embedding / np.linalg.norm(query_embedding)

# Normalize each product vector
normalized_tasks = task_embeddings / np.linalg.norm(task_embeddings, axis=1, keepdims=True)

# Compute similarity scores
similarity = normalized_query @ normalized_tasks.T

sorted_idx = (normalized_query @ normalized_tasks.T).argsort()[::-1]

for i, idx in enumerate(sorted_idx):
    print(f"[{i}] Kesamaan: {similarity[idx]:.3f} | {tasks[idx]}")
    print()