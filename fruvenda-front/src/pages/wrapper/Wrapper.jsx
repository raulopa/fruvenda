import React, { useState, useEffect } from 'react';
import LateralBar from "components/lateral-bar/LateralBar";
import { InputText } from "primereact/inputtext";
import { Cart } from "react-huge-icons/bulk";
import { Button } from "primereact/button";
import { Badge } from 'primereact/badge';
import { useNavigate } from 'react-router-dom';
import useSearchService from 'services/search-service/useSearchService';

export default function Wrapper({ page }) {
    let navigation = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [cartLength, setCartLength] = useState(localStorage.getItem('cartLength') || 0);
    const [openSearch, setOpenSearch] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('commerceToken')) {
            sessionStorage.setItem('entityType', 1);

        } else if (localStorage.getItem('token')) {
            sessionStorage.setItem('entityType', 0);
        }

        const handleStorageChange = () => {
            setCartLength(localStorage.getItem('cartLength') || 0);
        };

        window.addEventListener('cartLengthChanged', handleStorageChange);

        return () => {
            window.removeEventListener('cartLengthChanged', handleStorageChange);
        };
    }, []);

    const handleRouteCarrito = () => {
        navigation('/cart');
    };

    const handleSearch = () => {
        if (busqueda != null && busqueda != '') {
            navigation(`/search/${busqueda}`);
        }
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 600) {
                setOpenSearch(true);
            }
        };

        window.addEventListener('resize', handleResize);
        
        // Set initial state based on current window size
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <div className="relative h-full">
            <LateralBar />
            <div className={`fixed lg:md:absolute bg-white ${!openSearch ? sessionStorage.getItem('entityType') != '1' ? 'w-28' : 'w-20' : ''} lg:md:w-96 shadow-lg h-16 right-5 top-4 rounded-full flex items-center z-20`}>
                <div className='flex justify-around w-full items-center'>
                    <Button onClick={() => setOpenSearch(true)} className={`${openSearch ? 'hidden' : ''} lg:md:hidden flex w-10 h-10 rounded-full justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white`} icon='pi pi-search' />
                    <div className={`${openSearch==true ? 'w-9/12' : 'hidden lg:md:block'} lg:md:w-9/12 p-inputgroup flex lg:md:ml-2 rounded-full  h-10 overflow-hidden`}>
                    <Button onClick={() => setOpenSearch(false)} className={`${openSearch == false ? 'hidden' : ''} lg:md:hidden flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white h-full`} icon='pi pi-search-minus' />
                        <InputText
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            variant="filled"
                            className="w-full h-full pl-6"
                        />
                        <Button onClick={() => handleSearch()} icon="pi pi-search" className={`flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white h-full`} />
                    </div>
                    {sessionStorage.getItem('entityType') !== '1' &&
                        <Button onClick={handleRouteCarrito} className="w-12 lg:md:w-16 flex justify-center">
                            <Cart className='text-emerald-500 lg:md:w-9/12 lg:md:h-full h-10 w-10  ' />
                            {cartLength > 0 && (
                                <div className='absolute top-0 -right-0 lg:md:right-2 -mt-1'>
                                    <Badge value={cartLength} severity="danger"></Badge>
                                </div>
                            )}
                        </Button>
                    }

                </div>
            </div>
            <div className="w-full lg:md:wrapper-w h-full absolute right-0 z-10">
                {page}
            </div>


        </div>
    );
}
