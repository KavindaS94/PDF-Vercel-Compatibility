import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    maxHeight: 60,
    maxWidth: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    marginBottom: 30,
  },
  textContent: {
    fontSize: 14,
    lineHeight: 1.8,
    marginBottom: 20,
    color: '#333',
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  image: {
    maxWidth: '100%',
    maxHeight: 400,
  },
  footer: {
    marginTop: 50,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { content, title, logo, images } = await request.json();

    // Create the PDF document structure directly
    const MyDocument = React.createElement(Document, null,
      React.createElement(Page, { size: "A4", style: styles.page },
        // Header
        React.createElement(View, { style: styles.header },
          logo ? React.createElement(Image, { src: logo, style: styles.logo }) : null,
          React.createElement(Text, { style: styles.title }, title || 'Document')
        ),
        // Content
        React.createElement(View, { style: styles.content },
          content ? React.createElement(Text, { style: styles.textContent }, content) : null,
          // Images
          images && images.length > 0 ? images.map((img: string, index: number) =>
            React.createElement(View, { key: index, style: styles.imageContainer },
              React.createElement(Image, { src: img, style: styles.image })
            )
          ) : null
        ),
        // Footer
        React.createElement(View, { style: styles.footer },
          React.createElement(Text, null, `Generated on ${new Date().toLocaleDateString()}`)
        )
      )
    );

    // Render PDF to buffer directly
    const pdfBuffer = await renderToBuffer(MyDocument);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
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
