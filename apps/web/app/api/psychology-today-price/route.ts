import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const PSYCHOLOGY_TODAY_URL = 'https://www.psychologytoday.com/us/therapists/elora-silver-brooklyn-ny/1577352';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

let cachedPrice: { price: number | null; timestamp: number } | null = null;

export async function GET() {
  // Check cache first
  if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_DURATION) {
    return NextResponse.json({ price: cachedPrice.price, cached: true });
  }

  try {
    const response = await fetch(PSYCHOLOGY_TODAY_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Try multiple selectors to find the price
    // Psychology Today typically displays price in various formats
    let price: number | null = null;

    // Look for common price patterns in the HTML
    const pricePatterns = [
      // Look for "$XXX" patterns
      /\$(\d+)/g,
      // Look for "XXX per session" or "XXX/session"
      /(\d+)\s*(?:per\s*session|\/session)/gi,
    ];

    // Search in common sections where price might appear
    const priceSelectors = [
      '[data-testid*="price"]',
      '[class*="price"]',
      '[class*="fee"]',
      '[class*="cost"]',
      '.profile-detail',
      '.therapist-info',
      'section',
    ];

    for (const selector of priceSelectors) {
      const elements = $(selector);
      for (let i = 0; i < elements.length; i++) {
        const text = $(elements[i]).text();
        
        // Try to extract price from text
        for (const pattern of pricePatterns) {
          const matches = text.match(pattern);
          if (matches) {
            for (const match of matches) {
              const numMatch = match.match(/(\d+)/);
              if (numMatch) {
                const extractedPrice = parseInt(numMatch[1], 10);
                // Reasonable price range check (between $50 and $500)
                if (extractedPrice >= 50 && extractedPrice <= 500) {
                  price = extractedPrice;
                  break;
                }
              }
            }
            if (price) break;
          }
        }
        if (price) break;
      }
      if (price) break;
    }

    // If we still haven't found it, search the entire body text
    if (!price) {
      const bodyText = $('body').text();
      const dollarMatches = bodyText.match(/\$(\d+)/g);
      if (dollarMatches) {
        for (const match of dollarMatches) {
          const numMatch = match.match(/(\d+)/);
          if (numMatch) {
            const extractedPrice = parseInt(numMatch[1], 10);
            if (extractedPrice >= 50 && extractedPrice <= 500) {
              price = extractedPrice;
              break;
            }
          }
        }
      }
    }

    // Cache the result (even if null)
    cachedPrice = { price, timestamp: Date.now() };

    return NextResponse.json({ price, cached: false });
  } catch (error) {
    console.error('Error fetching price from Psychology Today:', error);
    
    // Return cached value if available, even if expired
    if (cachedPrice) {
      return NextResponse.json({ price: cachedPrice.price, cached: true, error: 'Failed to fetch, using cached value' });
    }
    
    // Return null if we have no cache
    return NextResponse.json({ price: null, error: 'Failed to fetch price' }, { status: 500 });
  }
}

