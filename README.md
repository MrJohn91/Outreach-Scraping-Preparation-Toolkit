# Outreach Scraping Preparation Toolkit

Lead generation toolkit for LinkedIn and X (Twitter) with Exa.ai-powered search.

## Quick Start on Replit

1. **Set Environment Variables** in Replit Secrets:
   - `APIFY_API_TOKEN` - Get from https://console.apify.com/account/integrations
   - `EXA_API_KEY` - Get from https://exa.ai

2. **Click Run** - The app will automatically:
   - Install dependencies
   - Build frontend
   - Start backend (port 8000)
   - Start frontend (port 5173)

3. **Access the app** via the Replit webview

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
