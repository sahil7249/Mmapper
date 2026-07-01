import logo from '../assets/logo.png'
import ProfileDropDown from "../components/dropdown-menu-profile-1";
import { ModeToggle } from '../components/mode-toggle';
import { SignUp, LogIn } from '../components/Buttons';
import { useState } from 'react';
import { AllMaps } from '../components/Buttons';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isUserSignedUp, setUserSignedUp] = useState(true)

    return (
        <div className='flex justify-between items-center border-b px-2.5'>
            <div className='w-20'>
                <Link to="/"><img src={logo} alt="Mmapper logo" /></Link>
            </div>
            <div className='flex items-center gap-2'>
               <Link to='/list'><AllMaps /> </Link> 
            </div>
        </div>
    )
}

export default Navbar;