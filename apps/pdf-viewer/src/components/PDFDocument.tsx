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

interface PDFDocumentProps {
  title: string;
  content: string;
  logo?: string;
  images?: string[];
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ title, content, logo, images }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {logo && <Image src={logo} style={styles.logo} />}
          <Text style={styles.title}>{title || 'Document'}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {content && (
            <Text style={styles.textContent}>{content}</Text>
          )}
          
          {/* Images */}
          {images && images.map((img, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image src={img} style={styles.image} />
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
