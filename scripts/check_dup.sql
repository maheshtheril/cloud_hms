SELECT "key", COUNT(*) 
FROM "menu_items" 
GROUP BY "key" 
HAVING COUNT(*) > 1;
