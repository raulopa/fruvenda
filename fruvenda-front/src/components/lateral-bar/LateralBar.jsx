import { useRef, useState, useEffect } from 'react';
import logo from '../../assets/img/logo-fruvenda-degrade.webp';
import { User, MiniStoreSmile, Logout, Dashboard, Grid, MenuCircleHorizontal, MenuUser, MenuLineVertical, MenuLineHorizontalHalf, MenuLineHorizontal } from 'react-huge-icons/bulk';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';


export default function LateralBar() {

    let navigation = useNavigate();
    const [open, setOpen] = useState(false);
    const entityType = sessionStorage.getItem('entityType');

    const handleNavigation = (keyword) => {
        switch (keyword) {
            case 'dashboard':
                navigation('/dashboard');
                break;
            case 'markets':
                navigation('/markets');
                break;
            case 'profile':
                navigation('/profile');
                break;
            case 'logout':
                navigation('/logout');
                break;
            case 'landing':
                navigation('/')
                break;
        }
    };


    return (
        <div id='lateralBar' className={`bg-white rounded-lg w-14 -ml-36 lg:md:h-full lg:md:ml-0 fixed z-20 shadow-lg flex flex-col items-center ${open && 'w-60 ml-0 px-2'} overflow-hidden transition-all`}>
            <Button onClick={() => setOpen(!open)} className={`${open && 'hidden'} lg:md:hidden cursor-pointer w-16 h-16 flex justify-center items-center fixed left-5 top-4 bg-white shadow-md rounded-full`}>
                <div className='flex flex-col justify-center items-center'><MenuLineHorizontal className='w-10 h-10 text-green-600 font-bold' /></div>
            </Button>
            <div onClick={() => handleNavigation('landing')} id="logo" className="mt-1 cursor-pointer flex items-center w-full">
                <img src={logo} className='w-14 p-2' alt="Logo" />
                <p className={`${open && 'bg-gradient-to-r mt-2 to-green-500 from-emerald-600 bg-clip-text'} text-center font-bold text-3xl text-transparent`}>Fruvenda</p>
            </div>
            <hr className='w-8/12' />
            <div className={`w-full h-3/6 ml-4 flex flex-col justify-start`}>
                <div className={`h-3/6 w-full flex flex-col justify-evenly items-start transition-all`}>
                    <Button onClick={() => handleNavigation('markets')} className='cursor-pointer flex items-center w-48'>
                        <div className='flex flex-col mr-2 justify-center items-center'><MiniStoreSmile className='w-10 h-10 text-green-600 font-bold' /></div>
                        <p className={`${open && 'transition-all bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text'} text-center font-bold text-xl text-transparent`}>Mercados</p>
                    </Button>
                    <Button onClick={() => handleNavigation('profile')} className='cursor-pointer flex items-center w-48'>
                        <div className='flex flex-col mr-2 justify-center items-center'><User className='w-10 h-10 text-green-600 font-bold' /></div>
                        <p className={`${open && 'bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text'} text-center font-bold text-xl text-transparent`}>{localStorage.getItem('commerceToken') || localStorage.getItem('token') ?  'Perfil' : 'Login'}</p>
                    </Button>
                    {(entityType == 1 || entityType == 0) && (
                        <Button onClick={() => handleNavigation('dashboard')} className='cursor-pointer flex items-center w-48 active:outline-none focus:outline-none'>
                            <div className='flex flex-col mr-2 justify-center items-center'><Dashboard className='w-10 h-10 text-green-600 font-bold' /></div>
                            <p className={`${open && 'transition-all bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text'} text-center font-bold text-xl text-transparent`}>Panel</p>
                        </Button>
                    )}


                </div>
            </div>
            <div className={`w-full h-3/6 ml-4 flex flex-col justify-end`}>
                <div className={`${(entityType == 1 || entityType == 0) ? 'h-2/6' : 'h-1/6'} w-full flex flex-col justify-evenly items-start transition-all`}>
                    <Button onClick={() => setOpen(!open)} className='cursor-pointer flex items-center w-48'>
                        <div className='flex flex-col mr-2 justify-center items-center'><MenuLineHorizontalHalf className='w-10 h-10 text-green-600 font-bold' /></div>
                        <p className={`${open && 'transition-all bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text'} text-center font-bold text-xl text-transparent`}>Cerrar</p>
                    </Button>
                    {(entityType == 1 || entityType == 0) && (
                        <Button onClick={() => handleNavigation('logout')} className='cursor-pointer flex items-center w-48'>
                            <div className='flex flex-col mr-2 justify-center items-center'><Logout className='w-10 h-10 text-green-600 font-bold' /></div>
                            <p className={`${open && 'transition-all bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text'} text-center font-bold text-xl text-transparent`}>Salir</p>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
