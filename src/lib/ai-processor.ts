import OpenAI from 'openai';
import { LinkMetadata, AISummary } from '@/types';

export class AIProcessor {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processMetadata(metadata: LinkMetadata, url: string): Promise<AISummary> {
    const prompt = this.buildPrompt(metadata, url);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a content analyzer. Extract and enhance information from webpage metadata.
                     Return a JSON object with: title (improved if needed), description (concise, 1-2 sentences),
                     category (single word), tags (array of 3-5 relevant tags), summary (2-3 sentences),
                     and keyPoints (optional array of 2-3 key takeaways).`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error('No content from AI');
      
      return JSON.parse(content) as AISummary;
    } catch (error) {
      console.error('AI processing failed:', error);
      return this.fallbackProcess(metadata);
    }
  }

  private buildPrompt(metadata: LinkMetadata, url: string): string {
    return `
      URL: ${url}
      Title: ${metadata.title}
      Description: ${metadata.description || 'Not available'}
      Keywords: ${metadata.keywords?.join(', ') || 'None'}
      Author: ${metadata.author || 'Unknown'}
      
      Based on this information, provide an enhanced summary and categorization.
      If the title or description seems incomplete or unclear, improve them.
      Determine the most appropriate category and relevant tags.
    `;
  }

  private fallbackProcess(metadata: LinkMetadata): AISummary {
    const domain = metadata.title?.toLowerCase() || '';
    let category = 'general';
    
    if (domain.includes('tech') || domain.includes('software')) category = 'technology';
    else if (domain.includes('news')) category = 'news';
    else if (domain.includes('blog')) category = 'blog';
    else if (domain.includes('video') || domain.includes('youtube')) category = 'video';
    
    return {
      title: metadata.title || 'Untitled',
      description: metadata.description || 'No description available',
      category,
      tags: metadata.keywords?.slice(0, 5) || [],
      summary: metadata.description || 'Content from ' + metadata.title,
    };
  }
}