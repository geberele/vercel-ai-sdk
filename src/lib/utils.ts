import { NextResponse } from 'next/server';

export const addOllamaLogging = async () => {
  console.log('Using local Ollama model. Ensuring connection...');
  try {
    // Optional: Add a quick check to see if Ollama is accessible
    const checkResponse = await fetch('http://localhost:11434/api/version', {
      method: 'GET',
    }).then((res) => res.json());
    console.log('Ollama server version:', checkResponse.version);
  } catch (error) {
    console.error('Error connecting to Ollama server:', error);
    return NextResponse.json(
      { error: 'Failed to connect to local Ollama server. Is it running?' },
      { status: 503 }
    );
  }
};
