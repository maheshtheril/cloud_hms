DELETE FROM "menu_items"
WHERE "id" IN (
  SELECT "id"
  FROM (
    SELECT "id",
           ROW_NUMBER() OVER (PARTITION BY "key" ORDER BY "created_at" ASC, "id" ASC) as row_num
    FROM "menu_items"
  ) t
  WHERE row_num > 1
);
