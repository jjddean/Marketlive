export interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

export async function askOllama(prompt: string, model: string = "llama3", format: string | undefined = "json"): Promise<string> {
    try {
        const body: any = {
            model,
            prompt,
            stream: false
        };
        if (format) body.format = format;

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error("Ollama connection failed. Ensure OLLAMA_ORIGINS='*' is set.");
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Ollama Error:", error);
        throw error;
    }
}

export const FREIGHT_PROMPT = `
You are a sophisticated FreightOps AI. 
Generate a JSON object representing a shipping document based on the filename provided.
The JSON must strictly follow this structure:
{
  "type": "bill_of_lading",
  "data": {
    "shipper": { "name": "...", "address": "..." },
    "consignee": { "name": "...", "address": "..." },
    "cargoDetails": { "description": "...", "weight": "...", "dimensions": "...", "value": "..." },
    "routeDetails": { "origin": "...", "destination": "..." }
  }
}
Generate realistic data (companies, addresses, cargo) based on the filename keywords.
Filename: 
`;
