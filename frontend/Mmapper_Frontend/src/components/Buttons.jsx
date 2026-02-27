import { useNavigate } from "react-router-dom"

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

export const MapButton = ({ name, handleClick, children }) => {
    return (

        <button className="border p-2 rounded-xl flex items-center gap-2 cursor-pointer" onClick={handleClick}>
            {children} {name}
        </button>
    )
}

export const AllMaps = ({ handleClick }) => {
    return (
        <button className='border p-2 rounded-xl cursor-pointer' onClick={handleClick}>
            All Maps
        </button>
    )
}

export const HomeBtn = ({children}) => {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate('/')
    }

    return (
        <button className='flex items-center gap-0.5 border p-2 rounded-xl cursor-pointer' onClick={handleClick}>
           {children} Home
        </button>
    )
}

export const CustomBtn = ({handleClick,children,name,isDisabled}) => {
    return (
        <button className='flex gap-0.5 items-center cursor-pointer border p-2 rounded-xl' onClick={handleClick}  disabled={isDisabled}>
            {children} {name}
        </button>
    )
}
