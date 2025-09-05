import * as cheerio from 'cheerio';
import { chromium } from 'playwright';
import { LinkMetadata } from '@/types';

export class WebScraper {
  async scrape(url: string): Promise<LinkMetadata> {
    // First try with cheerio (faster)
    try {
      return await this.scrapeStatic(url);
    } catch (error) {
      console.log('Static scraping failed, trying dynamic...');
      return await this.scrapeDynamic(url);
    }
  }

  private async scrapeStatic(url: string): Promise<LinkMetadata> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkOrganizer/1.0)'
      }
    });
    
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const metadata: LinkMetadata = {
      title: this.extractTitle($),
      description: this.extractDescription($),
      image: this.extractImage($, url),
      favicon: this.extractFavicon($, url),
      author: $('meta[name="author"]').attr('content'),
      publishedDate: $('meta[property="article:published_time"]').attr('content'),
      keywords: this.extractKeywords($),
      ogTitle: $('meta[property="og:title"]').attr('content'),
      ogDescription: $('meta[property="og:description"]').attr('content'),
      ogImage: $('meta[property="og:image"]').attr('content'),
      twitterCard: $('meta[name="twitter:card"]').attr('content'),
      twitterImage: $('meta[name="twitter:image"]').attr('content'),
    };
    
    return metadata;
  }

  private async scrapeDynamic(url: string): Promise<LinkMetadata> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      const metadata = await page.evaluate(() => {
        const getMeta = (name: string): string | undefined => {
          const element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
          return element?.getAttribute('content') || undefined;
        };
        
        return {
          title: document.title,
          description: getMeta('description') || getMeta('og:description'),
          image: getMeta('og:image'),
          ogTitle: getMeta('og:title'),
          ogDescription: getMeta('og:description'),
          ogImage: getMeta('og:image'),
          author: getMeta('author'),
          keywords: getMeta('keywords')?.split(',').map(k => k.trim()),
        };
      });
      
      return metadata as LinkMetadata;
    } finally {
      await browser.close();
    }
  }

  private extractTitle($: cheerio.CheerioAPI): string {
    return $('meta[property="og:title"]').attr('content') || 
           $('title').text() || 
           $('h1').first().text() || 
           'Untitled';
  }

  private extractDescription($: cheerio.CheerioAPI): string | undefined {
    return $('meta[name="description"]').attr('content') ||
           $('meta[property="og:description"]').attr('content') ||
           $('p').first().text().substring(0, 200);
  }

  private extractImage($: cheerio.CheerioAPI, baseUrl: string): string | undefined {
    const ogImage = $('meta[property="og:image"]').attr('content');
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    const firstImage = $('img').first().attr('src');
    
    const image = ogImage || twitterImage || firstImage;
    
    if (image && !image.startsWith('http')) {
      return new URL(image, baseUrl).href;
    }
    
    return image;
  }

  private extractFavicon($: cheerio.CheerioAPI, baseUrl: string): string | undefined {
    const favicon = $('link[rel="icon"]').attr('href') ||
                   $('link[rel="shortcut icon"]').attr('href');
    
    if (favicon && !favicon.startsWith('http')) {
      return new URL(favicon, baseUrl).href;
    }
    
    return favicon || `${new URL(baseUrl).origin}/favicon.ico`;
  }

  private extractKeywords($: cheerio.CheerioAPI): string[] {
    const keywords = $('meta[name="keywords"]').attr('content');
    return keywords ? keywords.split(',').map(k => k.trim()) : [];
  }
}