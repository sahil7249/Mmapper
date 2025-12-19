import express from 'express'
import dotenv from 'dotenv'
import processRouter from './router/process.router'

dotenv.config({path:'.env'})

const app = express()
const PORT = process.env.PORT || 8000

app.use('/api',processRouter)

app.listen(PORT,() => {
    console.log(`App is listening on http://localhost:${PORT}`)
})