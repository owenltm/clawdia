from datetime import date

class Product:
    def __init__(self, id: int, check_in_date: date, weight: int, supplier: str):
        self.id = id
        self.check_in_date = check_in_date
        self.weight = weight
        self.supplier = supplier

    def to_text(self):
        return f"Product of id: {self.id}, with weight of {self.weight} grams, checked in on {self.check_in_date} from {self.supplier}"
    
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

for product in products:
    print(product.to_text())