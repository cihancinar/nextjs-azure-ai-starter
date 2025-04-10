import { createAzure } from '@ai-sdk/azure';
import { streamText, generateObject } from 'ai';
import { z } from 'zod';

const azure = createAzure({
  baseURL: process.env.AZURE_OPENAI_RESOURCE_NAME,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
});

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const query = messages[messages.length - 1].parts[0].text;
  const model = azure('gpt-4o-mini');

  // First step: Classify the query type
  const { object: classification } = await generateObject({
    model,
    schema: z.object({
      reasoning: z.string(),
      type: z.enum(['general', 'refund', 'technical']),
      complexity: z.enum(['simple', 'complex']),
    }),
    prompt: `Classify this customer query:
    ${query}

    Determine:
    1. Query type (general, refund, or technical)
    2. Complexity (simple or complex)
    3. Brief reasoning for classification`,
  });

  console.log('Classification:', classification);

  // Route based on classification
  // Set model and system prompt based on query type and complexity
  const result = await streamText({
    model:
      classification.complexity === 'simple'
        ? azure('gpt-4o-mini')
        : azure('o3-mini'),
    system: {
      general:
        'You are an expert customer service agent handling general inquiries. Your name is CustomerServiceAgent. When you are answering, you start by saying who you are.',
      refund:
        'You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information. Your name is RefundAgent. When you are answering, you start by saying who you are.',
      technical:
        'You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting. Your name is TechnicalAgent. When you are answering, you start by saying who you are.',
    }[classification.type],
    prompt: query,
  });

  return result.toDataStreamResponse();
}