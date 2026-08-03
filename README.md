# FounderSync — Founder Compatibility Assessment

A React + Vite app for assessing founder-co-founder compatibility across 7 dimensions.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Features
- 25-question compatibility assessment
- Real-time co-founder sync via Supabase
- Full analytics dashboard (radar, line chart, capability map, risk map, AI insights)
- Shareable invite link for co-founder

## Supabase Table
Run this SQL in your Supabase dashboard:

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  founder_a JSONB,
  founder_b JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON sessions FOR ALL USING (true) WITH CHECK (true);
```

## Build for Production
```bash
npm run build
npm run preview
```
