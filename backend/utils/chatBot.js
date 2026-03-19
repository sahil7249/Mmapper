import { query } from "./callLama.js";

export const chatBot = (context,question) => {
    try {
        const response = query({
            messages: [

                {
                    "role": "system",
                    "content": `
                    You are a chat bot. You must return ONLY valid repsonse related to the question you have asked. The context is in markdwown format which is represents a mind map.
                    
                    Task: Keep given context in the memory and based on the context give the answer as the response of the question.
                    
                    
                    Rules:
                    - Give response in json format where para key have first paragraph and points key have remaining points.
                    - Keep the response in 3/1 ratio of bullet points to paragraph
                    - Keep the length of response brief.

                    Json format :
                     {
                        "para":"paragraph",
                        "points":["point1","point2"]
                     }

                    Question:
                    ${question}

                    Context:
                    ${context}
                    
                    Response:`
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