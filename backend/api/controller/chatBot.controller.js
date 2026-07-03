import { getResponse } from "../../services/chatBot.service.js"


export const getResponseFromBot =  async (req,res) => {
    const { context,question } = req?.body

    const response = await getResponse(context,question)

    return res.json({
        success:true,
        data:response
    })
}