# PDF Viewer & Generator

A modern web application built with Next.js and Puppeteer for viewing and generating PDFs with images, logos, and text content.

## Features

- **PDF Generation**: Create PDFs with custom content, logos, and images using Puppeteer
- **PDF Viewing**: View generated or uploaded PDFs with zoom, rotation, and navigation controls
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Monorepo Structure**: Organized with Turbo for efficient development

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **PDF Generation**: Puppeteer with Chromium
- **PDF Viewing**: React-PDF
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Monorepo**: Turbo

## Getting Started

### Prerequisites

- Node.js 20.16.0 or higher
- npm 9.8.1 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pdf-vercel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Generating PDFs

1. Click on the "Generate PDF" tab
2. Enter a document title
3. Add content (supports HTML formatting)
4. Upload a logo (optional)
5. Upload images (optional)
6. Click "Generate & Download PDF"

### Viewing PDFs

1. Click on the "View PDF" tab
2. Use the controls to:
   - Navigate between pages
   - Zoom in/out
   - Rotate the document
   - Download the PDF

## Project Structure

```
pdf-vercel/
├── apps/
│   └── pdf-viewer/          # Next.js application
│       ├── src/
│       │   ├── app/         # App router pages
│       │   ├── components/  # React components
│       │   └── api/         # API routes
│       └── public/          # Static assets
├── packages/                # Shared packages (future)
├── package.json            # Root package.json
└── turbo.json             # Turbo configuration
```

## API Endpoints

### POST /api/generate-pdf

Generates a PDF from provided content.

**Request Body:**
```json
{
  "title": "Document Title",
  "content": "HTML content",
  "logo": "base64-encoded-image",
  "images": ["base64-encoded-image1", "base64-encoded-image2"]
}
```

**Response:** PDF file with appropriate headers for download.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build artifacts

### Adding New Features

1. Create components in `apps/pdf-viewer/src/components/`
2. Add API routes in `apps/pdf-viewer/src/app/api/`
3. Update pages in `apps/pdf-viewer/src/app/`

## Deployment

The application can be deployed to Vercel, Netlify, or any platform that supports Next.js applications.

### Vercel Deployment

1. Connect your repository to Vercel
2. Set the build command to `npm run build`
3. Set the output directory to `apps/pdf-viewer/.next`
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
