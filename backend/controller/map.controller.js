import { Map } from "../database/map.model.js"

const saveMindMapToDB = async (req, res) => {
    const { title,markdown_content} = req?.body

    if ([title, markdown_content].some((field) => field.trim() === "")) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const map = await Map.create({
        title,
        markdown_content
    })

    const createdMap = await Map.findById(map._id)

    if (!createdMap) {
        return res.status(500).json({
            message: "Something went wrong while creating map"
        })
    }

    return res.status(200).json({
        success: true,
        message: "Map created and saved succesfully"
    })
}


export { saveMindMapToDB }