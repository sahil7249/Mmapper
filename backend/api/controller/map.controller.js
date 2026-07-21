import * as mapService from  "../../services/map.service.js"

export const saveMindMapToDB = async (req, res) => {
    const userId = req?.user.id

    const { title, markdown_content } = req?.body

    const map = await mapService.saveMindMap(title,markdown_content,userId);

    return res.status(200).json({
        success: true,
        message: "Map created and saved succesfully",
        map : map
    })
}


export const getAllMapData = async (req, res) => {
    const mapData = await mapService.getAllMap()

    return res.json({
        data: mapData
    })
}

export const getAllMapByUserId = async(req,res) => {
    const id = req?.user.id
    const mapData = await mapService.getMapByUserId(id)

    return res.json({
        message: "Map fetched successfully",
        data : mapData
    })

}

export const getMapById = async (req, res) => {
    const { id } = req?.params
    const map = await mapService.findMapById(id)
    return res.json({
        data: map
    })
  
}

export const updateMapById = async (req, res) => {
    const { id } = req?.params
    const data = req?.body
    const updatedMap = await mapService.updateMap(id,data)
    return res.json({
        message : "Map data is updated",
        data : updatedMap
    })

}

export const deleteMapById = async (req,res) => {
    const { id } = req?.params
    await mapService.deleteMap(id)

    return res.json({
        message : "Map deleted successfully"
    })

}
