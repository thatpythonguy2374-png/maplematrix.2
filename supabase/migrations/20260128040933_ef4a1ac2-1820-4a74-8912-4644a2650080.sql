-- Add RLS policy to deny all SELECT access to contact_submissions
-- Only service role (admin dashboard/backend) can read submissions
CREATE POLICY "No public read access to contact submissions"
ON public.contact_submissions
FOR SELECT
USING (false);

-- Also add policies to prevent UPDATE and DELETE
CREATE POLICY "No public update access to contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (false);

CREATE POLICY "No public delete access to contact submissions"
ON public.contact_submissions
FOR DELETE
USING (false);