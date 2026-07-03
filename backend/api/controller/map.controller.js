import { Map } from "../../database/map.model.js"
import { deleteMap, findMapById, getAllMap, saveMindMap, updateMap } from "../../services/map.service.js"

const saveMindMapToDB = async (req, res) => {
    const { title, markdown_content } = req?.body

    const map = await saveMindMap(title,markdown_content);

    return res.status(200).json({
        success: true,
        message: "Map created and saved succesfully"
    })
}


const getAllMapData = async (req, res) => {
    const mapData = await getAllMap()

    return res.json({
        data: mapData
    })
}

const getMapById = async (req, res) => {
    const { id } = req?.params
    const map = await findMapById(id)
    return res.json({
        data: map
    })
  
}

const updateMapById = async (req, res) => {
    const { id } = req?.params
    const data = req?.body
    const updatedMap = await updateMap(id,data)
    return res.json({
        message : "Map data is updated",
        data : updatedMap
    })

}

const deleteMapById = async (req,res) => {
    const { id } = req?.params
    await deleteMap(id)

    return res.json({
        message : "Map deleted successfully"
    })

}

export { saveMindMapToDB, getAllMapData, getMapById,updateMapById,deleteMapById }