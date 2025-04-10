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

  // Step 1: Classify the query type
  const classificationPrompt = `Classify this customer query:\n${query}

  Determine:
  1. Query type (general, refund, or technical)
  2. Complexity (simple or complex)
  3. Brief reasoning for classification
  `;

  const { object: classification } = await generateObject({
    model: azure('gpt-4o-mini'),
    schema: z.object({
      reasoning: z.string(),
      type: z.enum(['general', 'refund', 'technical']),
      complexity: z.enum(['simple', 'complex']),
    }),
    prompt: classificationPrompt,
  });

  // Step 2: Build the system prompt from a common base, a classification-specific string, and a unique name.
  const basePrompt = `
    When you answer, start by stating who you are and whether you will perform a simple or complex task on the first line. 
    Generate only short, concise answers.
  `;

  // Classification-specific prompts
  const classificationPrompts: Record<'general' | 'refund' | 'technical', string> = {
    general: 'You are an expert customer service agent handling general inquiries.',
    refund: 'You are an expert customer service agent specializing in refund requests.',
    technical: 'You are a technical support specialist with deep product knowledge.',
  };

  // Classification-specific agent names
  const classificationNames: Record<'general' | 'refund' | 'technical', string> = {
    general: 'GeneralHelperBot',
    refund: 'RefundAdvisor',
    technical: 'TechSupportWizard',
  };

  const agentName = classificationNames[classification.type];
  const systemPrompt = `
    ${basePrompt}
    ${classificationPrompts[classification.type]}
    Your name is ${agentName}, and you will perform a ${classification.complexity} task.
  `;

  // Step 3: Stream the response with the appropriate model & system prompt
  const result = await streamText({
    model:
      classification.complexity === 'simple'
        ? azure('gpt-4o-mini')
        : azure('o3-mini'),
    system: systemPrompt,
    prompt: query,
  });

  return result.toDataStreamResponse();
}