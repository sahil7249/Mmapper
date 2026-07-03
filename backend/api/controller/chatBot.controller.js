import { chatBot } from "../../utils/chatBot.js"


export const getResponseFromBot =  async (req,res) => {
    const { context,question } = req?.body

    const response = await chatBot(context,question)

    if(!response) {
        console.log("Failed to get response from chatbot")
    }

    console.log("Successfully received reponse")


    return res.json({
        success:true,
        data:response.choices[0].message.content
    })
}