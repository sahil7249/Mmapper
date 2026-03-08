import { Map } from "../database/map.model.js"

const saveMindMapToDB = async (req, res) => {
    const { title, markdown_content } = req?.body

    if ([title, markdown_content].some((field) => field.trim() === "")) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const map = await Map.create({
        title,
        markdown_content
    })


    if (!map) {
        return res.status(500).json({
            message: "Something went wrong while creating map"
        })
    }

    return res.status(200).json({
        success: true,
        message: "Map created and saved succesfully"
    })
}


const getAllMapData = async (req, res) => {
    const mapData = await Map.find()

    if (!mapData) {
        return res.status(404).json({
            message: "Map data is empty"
        })
    }

    return res.json({
        data: mapData
    })
}

const getMapById = async (req, res) => {
    const { id } = req?.params
    try {
        const mapData = await Map.findById(id)

        if (!mapData) {
            return res.status(404).json({
                message: "Map data not found"
            })
        }

        console.log(`Data extracted for id : ${id}`)
        

        return res.json({
            data: mapData
        })
    } catch (error) {
        console.log('Error: ', error.message)
    }
}

const updateMapById = async (req, res) => {
    const { id } = req?.params
    const { updateData } = req?.body

    try {
        const result = await Map.findByIdAndUpdate(id,{markdown_content:updateData},{new:true})

        if (!result) {
            return res.status(404).json({
                message: "Map data not found"
            })
        }
    
        console.log(`Map data updated id : ${id}`)

        return res.json({
            message: "Map data is updated"
        })
    } catch (error) {
        console.log('Error: ', error.message)
    }
}

const deleteMapById = async (req,res) => {
    const { id } = req?.params
    try {   
        const dbResponse = await Map.findByIdAndDelete(id)

        if(!dbResponse){
            return res.status(404).json({
                message:"Map data not found"
            })
        }

        console.log(`Map data is deleted for id : ${id}`)

        return res.json({
            message:"Map data is deleted"
        })

    } catch (error) {
        console.log("Error: ",error.message)
    }
}

export { saveMindMapToDB, getAllMapData, getMapById,updateMapById,deleteMapById }