import mongoose from 'mongoose'

const { Schema } = mongoose

const MapSchema = new Schema({
    title: {
        type: String,
        lowercase: true,
        required: true
    },
    markdown_content: {
        type:String,
        required:true
    }
}, { timestamps: true })

export const Map = mongoose.model('Map', MapSchema)