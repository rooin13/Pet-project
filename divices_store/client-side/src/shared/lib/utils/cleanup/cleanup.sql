DELETE FROM "User"
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY "updatedAt" DESC) AS rn
    FROM "User"
  ) t
  WHERE t.rn > 1
);