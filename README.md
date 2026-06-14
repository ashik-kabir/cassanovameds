# Cassanova Meds

Static site for the Casanova Medicals Protocol Program v1: free intake, clinician review, approved Protocol A/B enrollment at `$249/month`, and §07A outcomes tracking from day one.

## Public Site

- CloudFront: https://d3po29uan0qf3r.cloudfront.net/
- Primary domain: https://www.casanovamed.com/
- Apex domain: https://casanovamed.com/
- AWS Budget: `cassanovameds-monthly-20-usd` at `$20/month`

## Files

- `index.html` - deploy-ready HTML/CSS/JavaScript site.
- `assets/protocol-hero.png` - generated hero image used by the landing page.

## Local Preview

```bash
python3 -m http.server 8002
```

Then open `http://127.0.0.1:8002/`.
