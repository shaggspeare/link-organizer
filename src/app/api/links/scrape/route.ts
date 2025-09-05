import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Link from '@/models/Link';
import { WebScraper } from '@/lib/scraper';
import { AIProcessor } from '@/lib/ai-processor';
import { z } from 'zod';

const scrapeSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { url } = scrapeSchema.parse(body);
    
    // Check if link already exists
    const existingLink = await Link.findOne({ url });
    if (existingLink) {
      return NextResponse.json(existingLink);
    }
    
    // Create placeholder link
    const link = await Link.create({
      url,
      title: 'Processing...',
      description: 'Analyzing your link...',
      domain: new URL(url).hostname,
      status: 'PROCESSING',
    });
    
    try {
      // Scrape the website
      const scraper = new WebScraper();
      const metadata = await scraper.scrape(url);
      
      // Process with AI
      const aiProcessor = new AIProcessor();
      const aiData = await aiProcessor.processMetadata(metadata, url);
      
      // Update link with processed data
      link.title = aiData.title;
      link.description = aiData.description;
      link.imageUrl = metadata.ogImage || metadata.image;
      link.category = aiData.category;
      link.tags = aiData.tags;
      link.aiSummary = aiData.summary;
      link.status = 'COMPLETED';
      link.metadata = metadata;
      
      await link.save();
      
      return NextResponse.json(link);
    } catch (processingError) {
      // If processing fails, update status
      link.status = 'FAILED';
      link.title = metadata?.title || 'Failed to process';
      link.description = 'Could not analyze this link';
      await link.save();
      
      console.error('Processing error:', processingError);
      return NextResponse.json(link);
    }
  } catch (error) {
    console.error('Scrape error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to process link' },
      { status: 500 }
    );
  }
}