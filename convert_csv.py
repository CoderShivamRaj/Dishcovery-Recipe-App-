import pandas as pd

# Read your CSV
df = pd.read_csv("RECIPE.csv", encoding="utf-8")

# Save cleaned CSV again (optional, ensures proper encoding)
df.to_csv("recipes_clean.csv", index=False, encoding="utf-8")

# Save as JSON
df.to_json("recipes.json", orient="records", force_ascii=False)

print(" Done! Created: recipes_clean.csv and recipes.json")