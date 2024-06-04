import { useRef, useState } from 'react';
import logo from '../../assets/img/logo-fruvenda-degrade.webp';
import { User, MiniStoreSmile, Logout, Dashboard } from 'react-huge-icons/bulk';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';


export default function LateralBar() {
   
    let navigation = useNavigate();
    const [open, setOpen] = useState(false);
    const entityType = sessionStorage.getItem('entityType');

    const handleNavigation = (keyword) => {
        console.log('Navigating to:', keyword); // Agregar log para depuración
        switch(keyword){
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
                // Aquí puedes añadir la lógica para cerrar sesión
                navigation('/logout');
                break;
        }
    };

    return (
        <div className={`bg-white w-14 h-full fixed z-20 shadow-lg flex flex-col items-center ${open && 'w-52'} overflow-hidden transition-all`}>
            <div onClick={() => setOpen(!open)} id="logo" className="mt-1 cursor-pointer flex items-center w-full">
                <img src={logo} className='w-14 p-2' alt="Logo" />
                <p className={`${open && 'bg-gradient-to-r mt-2 to-green-500 from-emerald-600 bg-clip-text'} text-center font-bold text-3xl text-transparent`}>Fruvenda</p>
            </div>
            <hr className='w-8/12' />
            <div className={`w-full h-3/6 ml-4 flex flex-col justify-start`}>
                <div className={`h-2/6 w-full flex flex-col justify-evenly items-start transition-all`}>
                    <Button onClick={() => handleNavigation('markets')} className='cursor-pointer flex items-center w-48'>
                        <div className='flex flex-col mr-2 justify-center items-center'><MiniStoreSmile className='w-10 h-10 text-green-600 font-bold' /></div>
                        <p className={`${open && 'transition-all bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text'} text-center font-bold text-xl text-transparent`}>Mercados</p>
                    </Button>
                    <Button onClick={() => handleNavigation('profile')} className='cursor-pointer flex items-center w-48'>
                        <div className='flex flex-col mr-2 justify-center items-center'><User className='w-10 h-10 text-green-600 font-bold' /></div>
                        <p className={`${open && 'bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text'} text-center font-bold text-xl text-transparent`}>Perfil</p>
                    </Button>
                </div>
            </div>
            <div className={`w-full h-3/6 ml-4 flex flex-col justify-end`}>
                {(entityType == 1 || entityType == 0) && (
                    <div className='h-2/6 w-full flex flex-col justify-around items-start transition-all'>
                        <Button onClick={() => handleNavigation('dashboard')} className='cursor-pointer flex items-center w-48 active:outline-none focus:outline-none'>
                            <div className='flex flex-col mr-2 justify-center items-center'><Dashboard className='w-10 h-10 text-green-600 font-bold' /></div>
                            <p className={`${open && 'transition-all bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text'} text-center font-bold text-xl text-transparent`}>Panel</p>
                        </Button>
                        <Button onClick={() => handleNavigation('logout')} className='cursor-pointer flex items-center w-48'>
                            <div className='flex flex-col mr-2 justify-center items-center'><Logout className='w-10 h-10 text-green-600 font-bold' /></div>
                            <p className={`${open && 'transition-all bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text'} text-center font-bold text-xl text-transparent`}>Salir</p>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
