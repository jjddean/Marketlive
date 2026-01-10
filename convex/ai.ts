import { action } from "./_generated/server";
import { v } from "convex/values";

// Mock AI parsing
export const parseDocument = action({
    args: {
        fileData: v.string(), // Base64 or text content
        fileName: v.string(),
    },
    handler: async (ctx, args) => {
        console.log(`Analyzing document: ${args.fileName}`);

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Return mocked extracted data based on filename "hints" or random
        // In a real app, this would call OpenAI GPT-4o with the file content

        return {
            type: "bill_of_lading",
            confidence: 0.95,
            data: {
                shipper: {
                    name: "Global Electronics Ltd",
                    address: "123 Tech Park, Shenzhen, CN",
                },
                consignee: {
                    name: "TechRetail USA",
                    address: "456 Market St, San Francisco, CA",
                },
                cargoDetails: {
                    description: "Consumer Electronics - Laptops",
                    weight: "1500 kg",
                    dimensions: "120x80x100 cm",
                    value: "45000 USD",
                },
                routeDetails: {
                    origin: "Shenzhen",
                    destination: "Oakland",
                }
            }
        };
    },
});
