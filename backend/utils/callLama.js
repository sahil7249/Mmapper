const callGemini = async (extractedText) => {
    try {
        const prompt = `
You are a JSON generator.

Return ONLY valid JSON.

Task:
Convert the following document into a hierarchical mind map.

JSON format:

{
  "title": "Document Title",
  "nodes": [
    {
      "text": "Main Topic",
      "details": [
        "Important point 1",
        "Important point 2",
        "Important point 3"
      ],
      "children": [
        {
          "text": "Subtopic",
          "details": [
            "Important point",
            "Important point"
          ],
          "children": []
        }
      ]
    }
  ]
}

Rules:
- Analyze the entire document.
- Do not skip important information.
- Every major paragraph should belong to a topic.
- Keep "text" short (3-8 words).
- Store explanations as bullet points inside "details".
- Preserve the document hierarchy.
- Ignore diagrams, flowcharts, images, tables, ASCII art, equations and decorative formatting.
- Do not invent information.
- Do not repeat information.
- Return ONLY valid JSON.

Document:

${extractedText}
`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        responseMimeType: "application/json",
                        topP:0.95
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Gemini API Error");
        }

        return JSON.parse(data.candidates[0].content.parts[0].text);

    } catch (error) {
        return {
            error: error.message
        };
    }
};

export default callGemini;