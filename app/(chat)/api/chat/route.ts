import { createAzure } from '@ai-sdk/azure';
import { streamText } from 'ai';

const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
});

export const maxDuration = 30;

const systemPrompt = `
You are a friendly assistant! Keep your responses concise and helpful.
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: azure('gpt-4o'),
    system: systemPrompt,
    temperature: 0.3,
    maxRetries: 3,
    messages,
  });

  return result.toDataStreamResponse();
}