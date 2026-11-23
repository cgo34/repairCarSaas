-- Allows all authenticated users to read document_statuses
-- Required for invoice/quote queries that join on status:document_statuses(*)
-- Without this policy, PostgREST returns 403 for the entire query

CREATE POLICY "authenticated_read_document_statuses"
ON document_statuses
FOR SELECT
TO authenticated
USING (true);
