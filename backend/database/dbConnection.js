import mongoose from 'mongoose'

const connectToDB = async () => {
    const dbURI = `${process.env.MONGODB_URI}${process.env.DB_NAME}`

    try {
        const connectionInstance = await mongoose.connect(dbURI)
        console.log(`Mongo DB connected host:${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Database connection error", error)
        process.exit(1)
    }
}

export default connectToDB