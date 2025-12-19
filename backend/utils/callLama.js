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

const callLama = async (extractedText) => {
    try {
        const response = query({
            messages: [

                {
                    "role": "system",
                    "content": `
                    You are a JSON generator. You must return ONLY valid JSON, no explanations, no markdown formatting, no additional text.

                    Task: Convert this text into a hierarchical mind map structure.

                    Required JSON format:
                    {
                    "title": "Main document topic",
                    "nodes": [
                        {
                        "text": "Main Topic 1",
                        "children": [
                            {"text": "Subtopic 1.1", "children": []},
                            {"text": "Subtopic 1.2", "children": []}
                        ]
                        }
                    ]
                    }

                    Rules:
                    - Return ONLY the JSON object
                    - No markdown code blocks
                    - No explanations before or after
                    - Maximum 3 levels of depth
                    - Each node must have "text" and "children" fields

                    Text to analyze:
                    ${extractedText}

                    JSON output:`
                }
            ],
            model: "meta-llama/Llama-3.1-8B-Instruct:nebius",
            temperature: 0.0
        }).then((response) => {
            return response
        });

        return response;
    } catch (error) {
        return error.message
    }
}


export default callLama;