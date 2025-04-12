# Next.js Azure AI Agent Starter

This project provides a complete starter template for building AI-powered chat applications using Next.js and Azure OpenAI. It features a customizable chat interface with streaming responses and intelligent query classification.

![Chat Interface Preview](public/chatui.avif)

## Features

- 🤖 Intelligent query classification (general, refund, technical)
- 🔄 Streaming responses for real-time interaction
- 📱 Responsive, modern UI that works on all devices
- 🧠 Adaptive model selection based on query complexity
- 🎭 Dynamic AI agent personalities based on query type

## Getting Started

1. Clone this repository
2. Rename `.example.env.local` to `.env.local` and update your Azure OpenAI credentials:
```
AZURE_OPENAI_RESOURCE_NAME=your-resource-name 
AZURE_OPENAI_API_KEY=your-api-key
```

3. Install dependencies and start the development server:
```bash
npm install
npm run dev
```

4. Open http://localhost:3000 in your browser

## Project Structure

- `app/(chat)/page.tsx`: The main chat interface
- `app/(chat)/api/chat/route.ts`: API route containing the agent logic and LLM calls
- `components/`: Reusable UI components
- `public/`: Static assets including images

## Customization

You can easily customize this template:

- Modify the agent logic in `app/(chat)/api/chat/route.ts`
- Change the classification types and prompts
- Adjust the UI in `app/(chat)/page.tsx`
- Replace models with different Azure OpenAI deployments

## License

MIT

## Acknowledgements

- Built with [Next.js](https://nextjs.org/)
- Powered by [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
