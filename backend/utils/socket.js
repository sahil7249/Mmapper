import { Server } from 'socket.io'

let io

export const initSocket = (server) => {
    io = new Server(server,{
        cors:{
            origin:'http://localhost:5173',
            methods:['GET','POST']
        }
    })
    
    return io
}

export const getIO = () => {
    if(!io) throw new Error('Socket io is not initialized')
    return io
}
