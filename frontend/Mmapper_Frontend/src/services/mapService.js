import { api } from "../api/axios";

export const getAllMaps = async () => {
    const { data } = await api.get('/all-maps')
    return data.data
}

export const getMapById = async (id) => { 
    try {
        const { data }  = await api.get(`/${id}`) 
        return data.data
    } catch (error) {
        console.log("Error while fetching map by id: ",error.message)
    }
}

export const uploadPdf = (pdf) => {
    try {
        const { data } = api.post('/upload-pdf', pdf)
        return data
    } catch (error) {
        console.log("Error while uploading pdf: ",error.message)   
    }
}

export const saveMap = (mapData) => {
    try {
        const { data } = api.post('/save-map', mapData)
        return data
    } catch (error) {
        console.log("Error while saving data: ",error.message)
    }
}

export const deleteMap = (id) => api.delete(`/${id}/delete`)

export const updateMap = (updateData) => api.put(`/${id}/update`, updateData)
