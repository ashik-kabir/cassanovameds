# Casanova Medicals

Full-brand static site: medical navigation for Americans 55+ seeking care in SE Asia. Includes all three programs (The Reset / Restore / Renew), the CPP protocol intake, wellness partner showcase, origin stories, emergency protocol, AI concierge widget, and FAQ.

## Public Site

- CloudFront: https://d3po29uan0qf3r.cloudfront.net/
- Primary domain: https://www.casanovamed.com/
- Apex domain: https://casanovamed.com/
- AWS Budget: `cassanovameds-monthly-20-usd` at `$20/month`

## Files

- `index.html` — full site, deploy-ready HTML/CSS/JS
- `assets/protocol-hero.png` — hero background image
- `api/concierge.js` — Lambda function for AI concierge (Claude Haiku)

## Local Preview

```bash
python3 -m http.server 8002
```

Then open `http://127.0.0.1:8002/`.

## Wiring up the intake form (Supabase)

1. Create a Supabase project
2. Run this in the SQL editor:

```sql
CREATE TABLE intakes (
  id              BIGSERIAL PRIMARY KEY,
  email           TEXT NOT NULL,
  name            TEXT,
  score           INTEGER,
  priority        TEXT CHECK (priority IN ('priority','standard','general')),
  goal            TEXT,
  flags           TEXT,
  med_history     TEXT,
  clinician_status TEXT DEFAULT 'pending_review' CHECK (clinician_status IN ('pending_review','approved','not_approved')),
  created_at      TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert intakes" ON intakes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can select intakes" ON intakes FOR SELECT USING (false); -- use service role key in admin dashboard
```

3. In `index.html`, replace:
   - `REPLACE_WITH_SUPABASE_URL` → your project URL (`https://xxxx.supabase.co`)
   - `REPLACE_WITH_SUPABASE_ANON_KEY` → your anon/public key

## Wiring up the AI concierge (Lambda)

1. Deploy `api/concierge.js` as a Lambda function (Node 20.x)
2. Add environment variable: `ANTHROPIC_API_KEY`
3. Create an API Gateway HTTP API route: `POST /concierge`
4. Set `ALLOWED_ORIGIN` env var to `https://www.casanovamed.com,https://casanovamed.com`
5. In `index.html`, replace `REPLACE_WITH_CONCIERGE_API_ENDPOINT` → your API Gateway invoke URL

## Deploy to S3

```bash
aws s3 sync . s3://YOUR_BUCKET_NAME --exclude "*.md" --exclude "api/*" --exclude ".git/*"
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```
