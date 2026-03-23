import 'dotenv/config';
import { Langbase } from 'langbase';

// Run this using: npx tsx scripts/setup-faq.ts

const langbase = new Langbase({
  apiKey: process.env.LANGBASE_API_KEY!,
});

async function main() {
  try {
    console.log("Setting up Knowledge Base Memory (Using free Gemini Embedding)...");
    let memory;
    try {
      memory = await langbase.memories.create({
        name: 'knowledge-base',
        description: 'An AI memory for Uniserve campus services FAQ.',
        embedding_model: 'google:text-embedding-004' // Using Google's free embedding
      });
      console.log('✅ AI Memory created:', memory.name);
    } catch (e: any) {
      console.log('ℹ️ Memory might already exist. Ensure the model is set to Google AI in the Dashboard.');
    }

    console.log("Setting up AI Support Pipe (Using Groq Llama 3)...");
    let supportAgent;
    try {
      supportAgent = await langbase.pipes.create({
        name: 'ai-support-agent',
        description: 'An AI agent to support Uniserve users with their campus services queries.',
        model: 'groq:llama3-8b-8192', // Make sure you've added the Groq model!
        messages: [
          {
            role: 'system',
            content: "You're a helpful Uniserve AI assistant. You will assist users (students) with their campus queries about Laundry, Grooming, Tech Support, and Food Delivery. Always ensure that you provide accurate and to the point information based on the provided context.",
          },
        ],
      });
      console.log('✅ Support agent pipe created:', supportAgent.name);
    } catch (e: any) {
      console.log('ℹ️ Pipe might already exist. Ensure the model is set to Groq Llama in the Dashboard.');
    }
    
    console.log("\nSetup complete! You can now add FAQ documents to your memory on the Langbase dashboard, or we can write a script to upload them programmatically.");

  } catch (err: any) {
    console.error("❌ Error setting up Langbase resources:", err.message);
  }
}

main();
