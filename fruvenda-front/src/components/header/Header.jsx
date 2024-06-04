import { useState } from 'react';
import { MenuLineHorizontalHalf, Bag, User, MiniStoreSmile, Sun, HalfMoon } from 'react-huge-icons/bulk'
export default function Header() {
    const [clickMenu, setClickMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') == null ? false : localStorage.getItem('darkMode'));
    function toggleTheme() {
        if (!darkMode) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.add("bg-slate-800");
            document.documentElement.classList.remove("light");
            document.documentElement.classList.remove("bg-white");
        }
        else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.remove("bg-slate-800");
            document.documentElement.classList.add("bg-white");
            document.documentElement.classList.add("light");
        }

    }
    console.log('darkmode: ' + darkMode);
    console.log('lcoal: ' +localStorage.getItem('darkMode'))
    return (
        <header className="w-full h-24 flex justify-between relative ">
            <div id='header-wrapper' className='w-full h-24 flex justify-between absolute z-20 bg-white transition-all dark:bg-slate-800'>
                <div className="w-3/12 h-full flex items-center">
                    <h1 className="font-outfit-semibold ml-2 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-4xl text-transparent">fruvenda.</h1>
                </div>
                <div className='w-7/12 md:w-6/12 lg:w-4/12 h-full flex justify-end transition-all '>
                    <nav className='h-full w-full mr-4'>
                        <ul className='h-full w-full flex justify-end sm:justify-between items-center'>
                            <li className='cursor-pointer hidden sm:block'>
                                <div className='flex flex-col justify-center items-center'><Bag className='w-10 h-10 text-emerald-600 dark:text-emerald-400 font-bold' /></div>
                                <p className='text-center bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-xl text-transparent'> Productos</p>
                            </li>
                            <li className='cursor-pointer hidden sm:block'>
                                <div className='flex flex-col justify-center items-center'><MiniStoreSmile className='w-10 h-10 text-emerald-600 dark:text-emerald-400 font-bold' /></div>
                                <p className='text-center bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-xl text-transparent'>Mercados</p></li>
                            <li className='cursor-pointer hidden sm:block'>
                                <div className='flex flex-col justify-center items-center'><User className='w-10 h-10 text-emerald-600 dark:text-emerald-400 font-bold' /></div>
                                <p className='text-center bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-xl text-transparent'>Perfil</p>
                            </li>

                            <li className='cursor-pointer flex items-center justify-center h-full sm:hidden'><MenuLineHorizontalHalf onClick={() => setClickMenu(!clickMenu)} className={`w-16 h-16 text-emerald-600  dark:text-emerald-400 font-bold cursor-pointer transition-all ${clickMenu ? 'rotate-90' : ''}`} /></li>
                            <li className='cursor-pointer'>
                                <div className={`w-10 md:w-20 h-8 md:border md:border-1 md:dark:border-green-100 md:outline-gray-200 rounded-full flex items-center transition-all ease-in `} onClick={() => { setDarkMode(!darkMode); localStorage.setItem('darkMode', !darkMode); toggleTheme() }}>
                                    <div className={`w-12 h-12 bg-green-100 rounded-full transition-all ${darkMode ? 'md:ml-10' : 'md:ml-0'}`} >
                                        <Sun className={`w-12 h-12 text-emerald-500  rounded-full transition-all ${darkMode ? 'opacity-0 hidden' : 'opacity-100 block'}`} />
                                        <HalfMoon className={`w-12 h-12 text-emerald-500 rounded-full transition-all ${darkMode ? 'opacity-100 block' : 'opacity-0 hidden'}`} />
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div id='desplegable' className={`h-24 flex justify-center items-end p-2 absolute z-10 w-full bg-green-50 dark:dark:bg-slate-700 sm:hidden transition-all ease-in ${clickMenu ? 'mt-24 h-28' : ''}`}>
                <ul className=' w-full flex justify-around'>
                    <li>
                        <div className='flex flex-col justify-center items-center'><Bag className='w-16 h-16 text-emerald-600 font-bold dark:text-emerald-400' /></div>
                        <p className='text-center bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-xl text-transparent'> Productos</p>
                    </li>
                    <li>
                        <div className='flex flex-col justify-center items-center'><MiniStoreSmile className='w-16 h-16 text-emerald-600 font-bold dark:text-emerald-400' /></div>
                        <p className='text-center bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-xl text-transparent'>Mercados</p></li>
                    <li>
                        <div className='flex flex-col justify-center items-center'><User className='w-16 h-16 text-emerald-600 font-bold dark:text-emerald-400' /></div>
                        <p className='text-center bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-xl text-transparent'>Perfil</p>
                    </li>
                </ul>
            </div>
        </header>
    );
}