
import os

path = r"c:\2035-HMS\SAAS_ERP\prisma\schema.prisma"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Keep first 4256 lines
new_lines = lines[:4256]

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Truncated file successfully.")
