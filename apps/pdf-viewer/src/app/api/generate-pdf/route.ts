import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function POST(request: NextRequest) {
  try {
    const { content, title, logo, images } = await request.json();

    // Launch Chromium (works on Vercel / serverless)
    const isRunningOnVercel = !!process.env.VERCEL;
    const executablePath = isRunningOnVercel
      ? await chromium.executablePath()
      : undefined; // Use system Chrome/Chromium locally

    const browser = await puppeteer.launch({
      args: chromium.args,
      headless: chromium.headless,
      executablePath,
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });

    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title || 'Generated PDF'}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 40px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #e0e0e0;
              padding-bottom: 20px;
            }
            .logo {
              max-height: 60px;
              max-width: 200px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #2c3e50;
            }
            .content {
              margin-bottom: 30px;
            }
            .image-container {
              margin: 20px 0;
              text-align: center;
            }
            .image-container img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .text-content {
              font-size: 14px;
              line-height: 1.8;
              margin: 20px 0;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${logo ? `<img src="${logo}" alt="Logo" class="logo" />` : ''}
            <h1 class="title">${title || 'Document'}</h1>
          </div>
          
          <div class="content">
            ${content || ''}
            
            ${images && images.length > 0 ? images.map((img: string, index: number) => `
              <div class="image-container">
                <img src="${img}" alt="Image ${index + 1}" />
              </div>
            `).join('') : ''}
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    // Set content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(pdf as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${title || 'document'}.pdf"`
      }
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
