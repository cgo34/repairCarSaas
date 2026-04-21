-- Allows authenticated users to read vehicles
-- Required when selecting a garage on invoice/quote edit pages
CREATE POLICY "authenticated_read_vehicles"
ON vehicles
FOR SELECT
TO authenticated
USING (true);
