export interface LinkMetadata {
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  author?: string;
  publishedDate?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterImage?: string;
}

export interface ProcessedLink {
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  aiSummary: string;
  domain: string;
}

export interface AISummary {
  title: string;
  description: string;
  category: string;
  tags: string[];
  summary: string;
  keyPoints?: string[];
}

export enum LinkStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}