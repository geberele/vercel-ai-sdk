# Vercel AI SDK Demo

This is a [Next.js](https://nextjs.org) project demonstrating various AI capabilities using [Vercel AI SDK](https://sdk.vercel.ai/). The project includes 5 examples showcasing different use cases for generative AI.

## Examples Included

1. **Extraction**: Extract specific information from text (e.g., key takeaways from an essay)
2. **Classification**: Classify text into predefined categories
3. **Summarization**: Create concise summaries of longer texts
4. **Structured Extraction**: Extract structured data from unstructured content
5. **Chat**: Implement a conversational interface with AI

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

Each example is located in its own directory under `src/app/` (e.g., `src/app/1-extraction/`).

## Environment Setup

Create a `.env` file in the root directory of the project with the following variables:

```
# OpenAI API Key - required for OpenAI models
OPENAI_API_KEY=your_openai_api_key

# Anthropic API Key - required for Claude models
ANTHROPIC_API_KEY=your_anthropic_api_key

# Local LLaMA model configuration (if using local models)
LLAMA_MODEL_URL=your_local_llama_url

# Additional provider keys as needed
# MISTRAL_API_KEY=your_mistral_api_key
# GOOGLE_API_KEY=your_google_api_key

# Example configuration variables for AI SDK
AI_SDK_LOG_LEVEL=debug
```

You only need to add the API keys for the providers you plan to use. For example, if you're only using OpenAI models, you only need to provide the `OPENAI_API_KEY`.

### Local Model Setup with Ollama

For local development and testing without API costs, you can use [Ollama](https://ollama.com) to run models directly on your machine:

1. Download and install [Ollama](https://ollama.com) for your platform
2. Browse available models at [Ollama Model Library](https://ollama.com/search)
3. Pull models using the Ollama CLI (e.g., `ollama pull llama3`)
4. Configure your application to use the local Ollama endpoint

Popular Ollama models that work well with this demo include:

- `llama3` (8B, 70B) - General purpose models
- `llama3.1` (8B, 70B, 405B) - Improved reasoning capabilities
- `deepseek-r1` - Strong reasoning model comparable to commercial options
- `phi4` (14B) - Efficient and capable model from Microsoft
- `mixtral` (8x7B) - Mixture of Experts model with strong performance

To use these models with the AI SDK, you'll need to set up the OpenAI Compatible provider with your local Ollama server URL.

To obtain these API keys:

- [OpenAI API keys](https://platform.openai.com/account/api-keys)
- [Anthropic API keys](https://console.anthropic.com/account/keys)
- For local models, follow the setup instructions for your local LLM infrastructure

## Pricing

Using AI models from various providers incurs costs based on their pricing models. Here are links to pricing information for the major providers:

- [OpenAI Pricing](https://platform.openai.com/docs/pricing) - Pricing for GPT models and other OpenAI services
- [Anthropic Pricing](https://www.anthropic.com/api/pricing) - Pricing for Claude models
- [Mistral AI Pricing](https://mistral.ai/pricing/) - Pricing for Mistral models
- [Google AI Pricing](https://ai.google.dev/pricing) - Pricing for Google's Gemini models

For cost efficiency, consider:

- Using smaller models for simpler tasks (e.g., GPT-4o mini instead of GPT-4o)
- Setting appropriate token limits with the `maxTokens` parameter
- Running local models for development when possible

## Technologies Used

This project uses:

- [Next.js](https://nextjs.org/) for the framework
- [Vercel AI SDK](https://sdk.vercel.ai/) for AI capabilities
- [Zod](https://zod.dev/) for schema validation and type safety
- Various AI models including LLaMA and OpenAI models

## Learn More

To learn more about Next.js and the AI SDK:

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs/introduction)
- [Available Models and Capabilities](https://sdk.vercel.ai/docs/foundations/providers-and-models#model-capabilities) - View all supported AI models and their features
