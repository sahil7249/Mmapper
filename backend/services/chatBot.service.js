import { ApiError } from "../utils/ApiError.js"
import { chatBot } from "../utils/chatBot.js"

export const getResponse = async (context,question) => {
    const response = await chatBot(context,question)
    if(!response) {
        throw new ApiError("Failed to get response from chatbot",)
    }

    return response.choices[0].message.content
}