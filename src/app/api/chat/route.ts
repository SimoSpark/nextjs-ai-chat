import { OpenAIStream, StreamingTextResponse } from 'ai';

// Optional, but recommended: run on the edge runtime.
export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        // Extract the `messages` from the body of the request
        const { messages } = await req.json();

        // Verify we have an API key
        if (!process.env.OPENROUTER_API_KEY) {
            return new Response(
                JSON.stringify({ 
                    error: 'OpenRouter API key is not configured. Please add OPENROUTER_API_KEY to your .env.local file.' 
                }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log('Sending request to OpenRouter API...');
        
        // Request the OpenRouter API for the response
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                'X-Title': 'SparkAI Chat'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo', // You can change this to any model supported by OpenRouter
                messages: messages,
                stream: true,
            }),
        });

        // Check if the response was successful
        if (!response.ok) {
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || JSON.stringify(errorData);
            } catch {
                errorMessage = `OpenRouter API returned ${response.status} ${response.statusText}`;
            }
            
            console.error('OpenRouter API error:', errorMessage);
            
            return new Response(
                JSON.stringify({ error: errorMessage }),
                { status: response.status, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(response);

        // Respond with the stream
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error('Error in chat API route:', error);
        return new Response(
            JSON.stringify({ 
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                tip: 'Make sure you have set up your OPENROUTER_API_KEY in .env.local file'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}