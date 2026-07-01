const query = async (data) => {
    const response = await fetch(
        `${process.env.MODEL_URL}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.SECRET_KEY}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(data)
        }
    )

    const result = await response.json()
    return result
}

export const chatBot = (context,question) => {
    try {
        const response = query({
            messages: [

                {
                    "role": "system",
                    "content": `
                    You are a chatbot. Return ONLY a valid response to the given question. The context is in markdown format representing a mind map.

                    Task:
                    Use the provided context to generate the answer.

                    Rules:
                    - Output MUST be valid HTML only. No JSON, no explanations, no extra text.
                    - Use appropriate HTML tags based on the content.
                    - Wrap paragraphs in <p>.
                    - Use headings like <h1>, <h2>, <h3> where relevant.
                    - Use <ul>/<ol> with <li> for lists when needed.
                    - Use <strong> or <em> for emphasis if required.
                    - Maintain clean, semantic structure.
                    - Keep the response brief.

                    Question:
                    ${question}

                    Context:
                    ${context}

                    Response:
                    `
                }
            ],
            model: "meta-llama/Llama-3.1-8B-Instruct:novita",
            temperature: 0.0
        }).then((response) => {
            return response
        });

        return response;
    } catch (error) {
        return error.message
    }
}