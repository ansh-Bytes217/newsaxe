import { Router } from 'express';
import { openai } from '../utils/openai';
import prisma from '../utils/prisma';

const router = Router();

// Generate TL;DR summary for an article
router.post('/summary', async (req, res) => {
    const { articleId } = req.body;
    const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: { content: true },
    });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'Summarize the following news article in 2-3 sentences, preserving key facts.' },
            { role: 'user', content: article.content },
        ],
        temperature: 0.2,
    });
    const summary = completion.choices[0].message.content?.trim() ?? '';
    // Store summary for future use
    await prisma.article.update({ where: { id: articleId }, data: { summary } });
    res.json({ summary });
});

import { fetchNews } from '../services/newsService';
import Logger from '../utils/logger';

// ... (existing summary route is fine, keep it or let it be replaced if range includes it)

// Chatbot Endpoint (Agentic)
router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        // Define tools available to the LLM
        const tools = [
            {
                type: "function" as const,
                function: {
                    name: "search_news",
                    description: "Search for specific news articles, topics, or categories from around the world.",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "The search keywords, topic, or subject.",
                            },
                        },
                        required: ["query"],
                    },
                },
            },
        ];

        // First call to LLM
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use gpt-4 or gpt-3.5-turbo if 4o-mini not available/working
            messages: [
                { role: "system", content: "You are the NewsAXE Assistant. You help users stay updated with the latest news. Use the search_news tool if the user asks for current events or specific topics. Be concise, professional, and helpful." },
                ...messages
            ],
            tools: tools,
            tool_choice: "auto",
        });

        const responseMessage = response.choices[0].message;

        // Check if the model wanted to call a tool
        if (responseMessage.tool_calls) {
            const toolCall = responseMessage.tool_calls[0];
            // @ts-ignore
            const functionName = toolCall.function.name;
            // @ts-ignore
            const functionArgs = JSON.parse(toolCall.function.arguments);

            if (functionName === "search_news") {
                // Execute the tool
                const newsResults = await fetchNews({ q: functionArgs.query, language: 'en' });

                // Limit results to keep context small
                const snippets = newsResults.slice(0, 5).map((n: any) =>
                    `- ${n.title} (${n.pubDate}): ${n.description || 'No description'}`
                ).join('\n');

                // Second call to LLM to generate final answer
                const secondResponse = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are the NewsAXE Assistant." },
                        ...messages,
                        responseMessage,
                        {
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: snippets || "No news found for that query.",
                        }
                    ],
                });

                return res.json({ message: secondResponse.choices[0].message });
            }
        }

        // Return normal text response if no tool was called
        res.json({ message: responseMessage });

    } catch (error) {
        Logger.error('Chat Error:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
});

export default router;
