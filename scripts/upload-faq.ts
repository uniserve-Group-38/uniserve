import 'dotenv/config';
import { Langbase } from 'langbase';
import * as fs from 'fs';
import * as path from 'path';

// Run using: npx tsx scripts/upload-faq.ts

const langbase = new Langbase({
  apiKey: process.env.LANGBASE_API_KEY!,
});

async function uploadDocument() {
  try {
    const memoryName = 'knowledge-base';
    console.log(`Uploading FAQ to Memory: ${memoryName}...`);
    
    // Read the document as a File/Blob (we can pass raw text as a file to Langbase)
    const filePath = path.join(process.cwd(), 'faq-knowledge-base.txt');
    const content = await fs.promises.readFile(filePath);

    // Upload to Langbase
    const response = await langbase.memories.documents.upload({
      memoryName: memoryName,
      contentType: 'text/plain',
      documentName: 'faq-knowledge-base.txt',
      document: content,
    });

    console.log('✅ Document uploaded successfully!');
    console.log(response);

  } catch (error: any) {
    console.error('❌ Error uploading document:', error.message || error);
  }
}

uploadDocument();
