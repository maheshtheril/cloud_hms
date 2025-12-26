
path = r"c:\2035-HMS\SAAS_ERP\prisma\schema.prisma"
with open(path, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "model journal_entries" in line:
            print(f"Found at line {i+1}")
