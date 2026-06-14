
CREATE TABLE public.history_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.history_logs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.history_logs TO authenticated;
GRANT ALL ON public.history_logs TO service_role;
ALTER TABLE public.history_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read history" ON public.history_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert history" ON public.history_logs FOR INSERT WITH CHECK (true);
