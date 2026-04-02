import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import processRouter from './router/process.router.js'
import connectToDB from './database/dbConnection.js'
import { initSocket } from './utils/socket.js'
import { setServers } from 'node:dns'
setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config({ path: '.env' })

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 8000
const io = initSocket(server)

app.use(express.json())
app.use(cors())

app.use('/api/map', processRouter)

io.on('connection', (socket) => {
    console.log('Client Connected :', socket.id)

    socket.on('disconnect', () => {
        console.log('Client Disconnected: ', socket.id)
    })
})

io.engine.on("connection_error", (err) => {
    console.log(err.code);
    console.log(err.message);
})

connectToDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`App is listening on http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.log("MongoDB connection failed", error)
    })
