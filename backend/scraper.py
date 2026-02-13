"""
Apify integration module for multi-platform lead scraping.
Supports: LinkedIn (via Exa.ai), X (Twitter)
Requires APIFY_API_TOKEN and EXA_API_KEY to be set.
"""
import os
import uuid
from typing import List, Dict
from apify_client import ApifyClient


# Platform-specific Apify Actor IDs
ACTORS = {
    "linkedin": "fantastic-jobs/exa-ai-people-search",  # Exa.ai powered people search
    "x": "kaitoeasyapi/twitter-x-data-tweet-scraper-pay-per-result-cheapest",
    "twitter": "kaitoeasyapi/twitter-x-data-tweet-scraper-pay-per-result-cheapest",
}


def get_client() -> ApifyClient:
    """Get Apify client with token validation."""
    apify_token = os.getenv("APIFY_API_TOKEN")
    if not apify_token:
        raise ValueError("APIFY_API_TOKEN environment variable is required")
    return ApifyClient(apify_token)


def is_organization(name: str, bio: str, headline: str) -> bool:
    """Check if a result looks like an organization/company rather than a person."""
    name_lower = name.lower()

    # Only check name for clear organization indicators
    # These are words that are very unlikely to appear in a person's actual name
    org_name_indicators = [
        " inc", " ltd", " llc", " corp", " gmbh", " ag",
        "company", "group", "agency", "network", "foundation",
        "institute", "association", "university", "college"
    ]

    # Check if name contains organization indicators
    for indicator in org_name_indicators:
        if indicator in name_lower:
            return True

    # Check if name has no space (single word - likely a brand)
    words = name.split()
    if len(words) == 1 and len(name) > 3:
        # Single word names that look like brands (CamelCase)
        if any(c.isupper() for c in name[1:]):
            return True

    return False


def scrape_linkedin(keyword: str, location: str, max_results: int) -> List[Dict]:
    """Scrape LinkedIn PEOPLE profiles using Apify (supreme_coder/linkedin-profile-scraper).

    This actor accepts LinkedIn search URLs and returns actual people profiles.
    """
    print(f"🔗 Starting LinkedIn people search: {keyword} in {location}")
    client = get_client()

    # Build LinkedIn people search URL
    # Format: https://www.linkedin.com/search/results/people/?keywords=AI%20founder&origin=GLOBAL_SEARCH_HEADER
    from urllib.parse import quote

    search_query = keyword
    if location:
        search_query = f"{keyword} {location}"

    encoded_query = quote(search_query)
    search_url = f"https://www.linkedin.com/search/results/people/?keywords={encoded_query}&origin=GLOBAL_SEARCH_HEADER"

    print(f"   Search URL: {search_url}")

    # Get EXA API key for the actor
    exa_api_key = os.getenv("EXA_API_KEY")
    if not exa_api_key:
        raise ValueError("EXA_API_KEY environment variable is required for LinkedIn search")

    # Build search query
    query = f"{keyword} {location}".strip() if location else keyword

    # Build input for the Exa-powered people search actor
    run_input = {
        "query": query,
        "exaApiKey": exa_api_key,
        "maxResults": max_results,
    }

    try:
        print(f"   Calling Apify actor: {ACTORS['linkedin']}")
        run = client.actor(ACTORS["linkedin"]).call(run_input=run_input)
        print(f"   Actor run completed: {run.get('id', 'unknown')}")
    except Exception as e:
        print(f"   ❌ Apify actor call failed: {type(e).__name__}: {e}")
        raise

    results = []
    count = 0
    raw_count = 0
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        raw_count += 1
        # Debug: print first 3 raw items to see the structure
        if raw_count <= 3:
            print(f"   DEBUG raw item {raw_count}: {list(item.keys())}")
            print(f"   DEBUG sample values: {dict(list(item.items())[:5])}")

        if count >= max_results:
            break

        # Extract person's name from 'author' field (Exa format)
        full_name = item.get("author", item.get("name", "")).strip()

        # Skip if no name
        if not full_name or full_name == "Unknown":
            print(f"   Skipping: No name found")
            continue

        # Extract headline from title (format: "Name | Headline")
        title = item.get("title", "")
        headline = ""
        if "|" in title:
            headline = title.split("|", 1)[1].strip()

        # Get bio from text field
        bio = item.get("text", "")

        # Skip if this looks like an organization
        if is_organization(full_name, bio, headline):
            print(f"   Skipping organization: {full_name}")
            continue

        # Extract company from bio text (look for "at [Company]" pattern)
        current_company = ""
        current_title = headline

        # Try to extract location from text
        region = location
        if "Germany" in bio:
            region = "Germany"
        if "Berlin" in bio:
            region = "Berlin, Germany"

        # Get profile URL
        profile_url = item.get("url", "")

        try:
            results.append({
                "id": f"li_{uuid.uuid4().hex[:8]}",
                "name": full_name,
                "role": current_title or "",
                "company": current_company or "",
                "platform": "LinkedIn",
                "contact_link": profile_url or "",
                "region": region or "",
                "notes": keyword or "",
                "followers": 0,
                "industry": "",
                "headline": headline or "",
                "bio": (bio[:500] if bio else ""),
            })
            count += 1
            print(f"   ✓ Added person: {full_name}")
        except Exception as e:
            print(f"   ❌ Error adding {full_name}: {e}")

    print(f"✅ LinkedIn people search completed: {len(results)} results (filtered from raw data)")
    return results


def scrape_twitter(keyword: str, location: str, max_results: int) -> List[Dict]:
    """Scrape X/Twitter profiles using Apify."""
    print(f"🐦 Starting X/Twitter scrape: {keyword} in {location}")
    client = get_client()

    # Build search query
    search_query = f"{keyword} {location}".strip() if location else keyword

    run_input = {
        "twitterContent": search_query,
        "maxItems": max(max_results * 3, 20),  # Get more tweets to find unique users
        "queryType": "Top",
    }

    run = client.actor(ACTORS["x"]).call(run_input=run_input)

    results = []
    seen_users = set()

    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        # Get author info from tweet
        author = item.get("author", {})
        user_name = author.get("userName", "")

        if not user_name or user_name in seen_users:
            continue
        seen_users.add(user_name)

        results.append({
            "id": f"x_{uuid.uuid4().hex[:8]}",
            "name": author.get("name", "Unknown"),
            "role": f"@{user_name}",
            "company": "",
            "platform": "X",
            "contact_link": f"https://x.com/{user_name}",
            "region": author.get("location", location),
            "notes": keyword,
            "followers": author.get("followers", 0),
            "verified": author.get("isBlueVerified", author.get("isVerified", False)),
            "bio": author.get("description", ""),
        })

        if len(results) >= max_results:
            break

    print(f"✅ X/Twitter scrape completed: {len(results)} results")
    return results


def scrape_tiktok(keyword: str, location: str, max_results: int) -> List[Dict]:
    """Scrape TikTok profiles using Apify."""
    print(f"🎵 Starting TikTok scrape: {keyword}")
    client = get_client()

    # Build search query
    search_query = f"{keyword} {location}".strip() if location else keyword

    run_input = {
        "searchQueries": [search_query],
        "resultsPerPage": max_results * 2,  # Get more to find unique users
        "searchSection": "/user",  # Search for user profiles
        "maxProfilesPerQuery": max_results,
    }

    run = client.actor(ACTORS["tiktok"]).call(run_input=run_input)

    results = []
    seen_users = set()

    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        # Handle both video results and user results
        if "authorMeta" in item:
            author = item.get("authorMeta", {})
        elif "author" in item:
            author = item.get("author", {})
        else:
            author = item  # Item might be a user directly

        unique_id = author.get("uniqueId", author.get("id", ""))

        if not unique_id or unique_id in seen_users:
            continue
        seen_users.add(unique_id)

        results.append({
            "id": f"tt_{uuid.uuid4().hex[:8]}",
            "name": author.get("nickname", author.get("name", "Unknown")),
            "role": f"@{unique_id}",
            "company": "",
            "platform": "TikTok",
            "contact_link": f"https://tiktok.com/@{unique_id}",
            "region": location,
            "notes": keyword,
            "followers": author.get("fans", author.get("followerCount", 0)),
            "likes": author.get("heart", author.get("heartCount", 0)),
            "verified": author.get("verified", False),
            "bio": author.get("signature", author.get("bio", "")),
        })

        if len(results) >= max_results:
            break

    print(f"✅ TikTok scrape completed: {len(results)} results")
    return results


def scrape_leads(
    keyword: str,
    location: str,
    platform: str = "linkedin",
    max_results: int = 20
) -> List[Dict]:
    """
    Main scraping function - dispatches to platform-specific scrapers.

    Args:
        keyword: Search term (e.g., "AI founders", "Web3 startups")
        location: Location/region (e.g., "Berlin, Germany")
        platform: Platform to scrape (linkedin, x, tiktok)
        max_results: Maximum number of results

    Returns:
        List of lead records
    """
    platform = platform.lower()

    if platform == "linkedin":
        return scrape_linkedin(keyword, location, max_results)
    elif platform in ["x", "twitter"]:
        return scrape_twitter(keyword, location, max_results)
    elif platform == "tiktok":
        return scrape_tiktok(keyword, location, max_results)
    elif platform == "telegram":
        raise ValueError("Telegram scraping requires specific channel names. Use LinkedIn, X, or TikTok for keyword-based search.")
    else:
        raise ValueError(f"Unknown platform: {platform}. Use: linkedin, x, tiktok")
