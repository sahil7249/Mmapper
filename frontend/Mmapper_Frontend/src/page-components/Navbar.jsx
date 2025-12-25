import logo from '../assets/logo.png'
import ProfileDropDown from "../components/dropdown-menu-profile-1";
import { ModeToggle } from '../components/mode-toggle';
import { SignUp, LogIn } from '../components/Buttons';
import { useState } from 'react';
import { AllMaps } from '../components/Buttons';
import { useContext } from 'react';
import { UIStateContext } from '../App';

const Navbar = () => {
    const [isUserSignedUp, setUserSignedUp] = useState(true)
    const { state,setState } = useContext(UIStateContext); 
    const handleClick = () => {
        setState("list")
    }

    return (
        <div className='flex justify-between items-center border-b px-2.5'>
            <div className='w-20'>
                <a href="/"><img src={logo} alt="Mmapper logo" /></a>
            </div>
            <div className='flex items-center gap-2'>
                <AllMaps handleClick={handleClick} />
                { isUserSignedUp ? <LogIn /> : <SignUp />}
                <ModeToggle />
                <ProfileDropDown />
            </div>
        </div>
    )
}

export default Navbar;