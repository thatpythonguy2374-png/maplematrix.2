-- Create table to track contact form rate limits
CREATE TABLE public.contact_rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text NOT NULL,
  user_agent_hash text,
  submitted_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- Deny all public access (only service role can access)
CREATE POLICY "No public read access to rate limits"
ON public.contact_rate_limits FOR SELECT USING (false);

CREATE POLICY "No public insert access to rate limits"
ON public.contact_rate_limits FOR INSERT WITH CHECK (false);

CREATE POLICY "No public update access to rate limits"
ON public.contact_rate_limits FOR UPDATE USING (false);

CREATE POLICY "No public delete access to rate limits"
ON public.contact_rate_limits FOR DELETE USING (false);

-- Index for efficient lookups
CREATE INDEX idx_contact_rate_limits_ip_time 
ON public.contact_rate_limits (ip_address, submitted_at DESC);

-- Cleanup function to remove old entries (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.contact_rate_limits
  WHERE submitted_at < now() - interval '24 hours';
$$;