import { Download } from 'lucide-react'
export const SignUp = () => {
    return (
        <a href="#" className="border p-2 rounded-xl">
            Sign Up
        </a>
    )
}

export const LogIn = () => {
    return (
        <a href="#" className="border p-2 rounded-xl">
            Login
        </a>
    )
}

export const MapButton = ({ name, onClick,children }) => {
    return (
        
        <button className="border p-2 rounded-xl flex items-center gap-2">
            {children} {name}
        </button>
    )   
}