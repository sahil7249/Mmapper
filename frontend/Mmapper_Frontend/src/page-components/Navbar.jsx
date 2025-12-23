import logo from '../assets/logo.png'
import ProfileDropDown from "../components/dropdown-menu-profile-1";
import { ModeToggle } from '../components/mode-toggle';
import { SignUp, LogIn } from '../components/Buttons';
import { useState } from 'react';



const Navbar = () => {
    const [isUserSignedUp, setUserSignedUp] = useState(true)

    return (
        <div className='flex justify-between items-center border-b px-2.5'>
            <div className='w-20'>
                <img src={logo} alt="Mmapper logo" />
            </div>
            <div className='flex items-center gap-2'>
                { isUserSignedUp ? <LogIn /> : <SignUp />}
                <ModeToggle />
                <ProfileDropDown />
            </div>
        </div>
    )
}

export default Navbar;