# Outreach Scraping Preparation Toolkit

Lead generation toolkit for LinkedIn and X (Twitter) with Exa.ai-powered search.

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/outreach-toolkit)

### Deployment Steps

1. **Go to Railway:**
   - Visit https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `MrJohn91/Outreach-Scraping-Preparation-Toolkit`

2. **Set Environment Variables:**
   - `APIFY_API_TOKEN` = your Apify token
   - `EXA_API_KEY` = your Exa.ai key

3. **Deploy** - Railway will automatically build and deploy

4. **Access your app** at the Railway-provided URL

## Features

- 🔍 LinkedIn & X profile search with natural language queries
- 📊 Results table with sorting and pagination
- 💾 Save and bookmark leads
- 📥 Export to CSV
- 💰 Cost estimation tool

## Tech Stack

- **Backend:** FastAPI (Python)
- **Frontend:** React + Vite + Tailwind CSS
- **Scraping:** Apify + Exa.ai

## Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

## Documentation

See `/docs` folder for:
- `SETUP.md` - Detailed setup instructions
- `ARCHITECTURE.md` - System architecture
- `COST_ESTIMATION.md` - Pricing analysis

## Environment Variables

Create a `.env` file in the root:

```env
APIFY_API_TOKEN=your_apify_token
EXA_API_KEY=your_exa_key
```

## Roadmap

**Phase 1 (Current):** DM-based outreach with profile data  
**Phase 2 (Future):** Email extraction and enrichment

## License

MIT
