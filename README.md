# Cassanova Meds

Static peptide care landing page for Casanova Medicals.

## Public Site

- CloudFront: https://d3po29uan0qf3r.cloudfront.net/
- Domain target: `casanovamed.com` is owned and DNS is configured, but Amazon Registrar still reports `clientHold`.
- AWS Budget: `cassanovameds-monthly-20-usd` at `$20/month`

## Files

- `index.html` - deploy-ready HTML/CSS/JavaScript site.
- `assets/peptide-hero.png` - generated hero image used by the landing page.

## Local Preview

```bash
python3 -m http.server 8002
```

Then open `http://127.0.0.1:8002/`.
