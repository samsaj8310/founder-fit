-- ==========================================
-- 1. Create the `sessions` Table
-- ==========================================
-- NOTE: We use JSONB for founder_a and founder_b. 
-- The application dynamically saves the following shape into these columns:
-- {
--    "name": "Alex Chen",
--    "answers": { "Strategy": 80, "Roles": 60, ... },
--    "profile": { "name": "Alex Chen", "phone": "9876543210", "email": "alex@startup.com", "company": "TechVenture", "designation": "CEO", "address": "Blr" },
--    "pdf_url": "https://hhjmgdqucugcoctdfyvz.supabase.co/storage/v1/object/public/reports/dashboard-XXX.pdf"
-- }
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_a JSONB,
    founder_b JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Optional: Enable Row Level Security
-- ==========================================
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access" 
ON public.sessions FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Allow anonymous insert access" 
ON public.sessions FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" 
ON public.sessions FOR UPDATE 
TO anon 
USING (true);

-- ==========================================
-- 3. Create the `reports` Storage Bucket
-- ==========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

-- Allows anyone to upload to the reports bucket
CREATE POLICY "Public Upload" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'reports');

-- Allows anyone to view files in the reports bucket
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'reports');
