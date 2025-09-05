# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.2 application called "link-organizer" that uses TypeScript, React 19, and Tailwind CSS 4. The project includes dependencies for web scraping (Cheerio, Playwright), database integration (Mongoose), AI integration (OpenAI), and UI components (React Masonry CSS).

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Testing
No test scripts are currently configured in package.json.

## Project Structure

This is a Next.js 15 application using the App Router pattern:
- `src/app/` - Next.js app directory with pages and layouts
- `src/app/layout.tsx` - Root layout with Geist fonts
- `src/app/page.tsx` - Homepage component
- TypeScript path alias `@/*` maps to `./src/*`

## Technology Stack

### Core Framework
- Next.js 15.5.2 with App Router
- React 19.1.0
- TypeScript 5

### Styling
- Tailwind CSS 4 with PostCSS
- Geist fonts (Sans and Mono)

### Dependencies
- **Database**: Mongoose for MongoDB
- **AI**: OpenAI SDK
- **Web Scraping**: Cheerio, Playwright
- **Validation**: Zod
- **UI**: React Masonry CSS

### Configuration
- ESLint with Next.js TypeScript config
- TypeScript with strict mode enabled
- Next.js config uses default settings

## Development Notes

- Uses Turbopack for faster builds and development
- TypeScript strict mode is enabled
- Path aliases configured for cleaner imports (`@/`)
- ESLint configured with Next.js core web vitals and TypeScript rules