import { Map } from "../database/map.model.js"
import { ApiError } from "../utils/ApiError.js"

export const saveMindMap = async (title,markdown_content,userId) => {
    if([title,markdown_content].some((field) => field.trim() == "")){
        throw new ApiError("All fields are required",400)
    }
    try {
        const map = await Map.create({
            title,
            markdown_content,
            userId: userId
        })
        
        if(!map) {
            throw new ApiError("Something went wrong while creating map")  
        }
        
        return map

    } catch (error) {
        console.log("Error while creating map : ",error.message)
    
        throw new ApiError("Error: ", error.message)
        
    } 
}

export const getAllMap = async () => {
    const maps = await Map.find()

    if(!maps) {
        throw new ApiError("Does not have any maps",404)
        
    }
    return maps
}

export const findMapById = async (id) => {
    try {
        const map = await Map.findById(id)
        if(map == null) {        
            throw new ApiError(`Map does not exists with id : ${id}`,404)
        }

        return map

    } catch (error) {
        throw new ApiError(`Error: ${error.message}`)
    }
}

export const updateMap = async (id,data) => {
    try {
        if(!data) {
            throw new ApiError("No data provided",400)
        }
        const updatedMap = await Map.findByIdAndUpdate(id,{ title : data?.title,markdown_content : data?.markdown_content},{ new : true })
        if(!updatedMap) {
            throw new ApiError("Failed to update map")
        }
        return updatedMap
    } catch (error) {
        throw new ApiError(`Error : ${error.message}`)
    }
}

export const deleteMap = async (id) => {
    try {
        const deletedMap = await Map.findByIdAndDelete(id)
        if(!deletedMap) {
            throw new ApiError(`Map does not exists with id : ${id}`,404)
        }
        return deletedMap
    } catch (error) {
        throw new ApiError(error.message)
    }
}

export const getMapByUserId = async (id) => {
    try {
        const mapsData = await Map.find({ userId : id})
    
        if(!mapsData) {
            throw new ApiError(`No map data exists for user id : ${id}`)
        }

        return mapsData
        
    } catch (error) {
        throw new ApiError(`Error while fetching map : ${error.message}`)        
    }
}