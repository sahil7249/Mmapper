import { useEffect, useState } from "react";

export const useMap = (mapFunction, params = null) => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                setLoading(true)
                const response =
                    params !== null
                        ? await mapFunction(params)
                        : await mapFunction()
                setData(response)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMapData()

    }, [mapFunction, params])

    return { data, error, loading }
}