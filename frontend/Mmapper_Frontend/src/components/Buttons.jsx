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

export const MapButton = ({ name, handleClick,children }) => {
    return (
        
        <button className="border p-2 rounded-xl flex items-center gap-2 cursor-pointer" onClick={handleClick}>
            {children} {name}
        </button>
    )   
}

export const AllMaps = ({handleClick}) =>{
    return(
        <button className='border p-2 rounded-xl cursor-pointer' onClick={handleClick}>
            All Maps
        </button>
    )
}