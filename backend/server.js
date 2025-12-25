import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import processRouter from './router/process.router.js'

dotenv.config({path:'.env'})

const app = express()
const PORT = process.env.PORT || 8000
const corsOptions = {
    origin:'http://localhost:5173',
    optionsSuccessStatus:200
}


app.use(express.json())
app.use(cors(corsOptions))

app.use('/api',processRouter)

app.listen(PORT,() => {
    console.log(`App is listening on http://localhost:${PORT}`)
})