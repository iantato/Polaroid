

-- Create new polaroid
INSERT INTO polaroids (alt, image, caption) VALUES ($1, $2, $3);

-- Update scanned
UPDATE polaroids SET scanned = $1, scanned_at = $2 WHERE id = $3;