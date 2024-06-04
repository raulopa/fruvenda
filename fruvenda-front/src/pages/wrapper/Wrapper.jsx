import React, { useState, useEffect } from 'react';
import LateralBar from "components/lateral-bar/LateralBar";
import { InputText } from "primereact/inputtext";
import { Cart } from "react-huge-icons/bulk";
import { Button } from "primereact/button";
import { Badge } from 'primereact/badge';
import { useNavigate } from 'react-router-dom';

export default function Wrapper({ page }) {
    let navigation = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [cartLength, setCartLength] = useState(localStorage.getItem('cartLength') || 0);


    
    useEffect(() => {
        if (localStorage.getItem('commerceToken')) {
            sessionStorage.setItem('entityType', 1);
    
        } else {
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

    return (
        <div className="relative h-full">
            <LateralBar />
            <div className="wrapper-w h-full absolute right-0 z-10">
                {page}
            </div>
            {sessionStorage.getItem('entityType') !== '1' &&
                <div className="absolute w-96 shadow-lg h-16 right-5 top-3 rounded-full flex items-center z-20">
                    <div className='flex justify-around w-full items-center'>
                        <div className="p-inputgroup flex ml-2 mt rounded-full w-9/12 h-10 overflow-hidden">
                            <InputText
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                variant="filled"
                                className="w-full h-full"
                            />
                            <Button icon="pi pi-search" className="flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white h-full" />
                        </div>
                        <Button onClick={handleRouteCarrito} className="w-2/12 flex justify-center">
                            <Cart className='text-emerald-500 w-9/12 h-full mt-1 mr-3' />
                            {cartLength > 0 && (
                                <div className='absolute top-0 right-2 -mt-1'>
                                    <Badge value={cartLength} severity="danger"></Badge>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            }
        </div>
    );
}
