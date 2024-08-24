from datetime import date
import ollama
import numpy as np

class Product:
    def __init__(self, id: int, check_in_date: date, weight: int, supplier: str):
        self.id = id
        self.check_in_date = check_in_date
        self.weight = weight
        self.supplier = supplier

    def to_text(self):
        return f"Product of id: {self.id}, with weight of {self.weight} grams, checked in on {self.check_in_date} from {self.supplier}"
        # return f"Product id {self.id} weight is {self.weight} grams"
    
# Hardcoded list of 10 Product objects
products = [
    Product(1, date(2023, 1, 15), 450, "A"),
    Product(2, date(2023, 2, 10), 700, "B"),
    Product(3, date(2023, 3, 5), 350, "C"),
    Product(4, date(2023, 4, 25), 800, "D"),
    Product(5, date(2023, 5, 30), 600, "E"),
    Product(6, date(2023, 6, 15), 500, "F"),
    Product(7, date(2023, 7, 20), 750, "G"),
    Product(8, date(2023, 8, 5), 300, "H"),
    Product(9, date(2023, 9, 10), 850, "I"),
    Product(10, date(2023, 10, 15), 400, "J"),
]

embedded_products = [None] * len(products)

for i, product in enumerate(products):
    embedded_products[i] = ollama.embeddings(model='llama3.1', prompt=products[i].to_text())['embedding']
    print(f"{product.to_text()}")

stream = ollama.chat(
    model='llama3.1',
    messages=[{'role': 'user', 'content': 'Why is the sky blue?'}],
    stream=True,
)

embedded_query = ollama.embeddings(model='llama3.1', prompt='I want products from J')['embedding']

print("Shape of embedded_query:", np.array(embedded_query).shape)
print("Shape of embedded_products:", np.array(embedded_products).shape)
# Normalize the query vector
normalized_query = embedded_query / np.linalg.norm(embedded_query)

# Normalize each product vector
normalized_products = embedded_products / np.linalg.norm(embedded_products, axis=1, keepdims=True)

# Compute similarity scores
similarity = normalized_query @ normalized_products.T

sorted_idx = (normalized_query @ normalized_products.T).argsort()[::-1]

for i, idx in enumerate(sorted_idx):
    print(f"[{i}] Kesamaan: {similarity[idx]:.3f} | {products[idx].to_text()}")
    print()