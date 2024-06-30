import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const Header = ({ nombre, foto_perfil, slug}) => {
    let navigation = useNavigate();
    const [over, setOver] = useState(false);
    const [phone, setPhone] = useState(false);
    const handleNavigation = (slug) => {
        navigation(`/profile/${slug}`)
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1023) {
               setPhone(true)
            } else {
                setPhone(false)
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                <img src={foto_perfil} alt={foto_perfil} className="lg:md:w-24 lg:md:h-24 w-12 h-12 rounded-full lf:md:mr-10 mr-2" />
                <p className="text-aureus-m lg:md:text-aureus-l">{nombre}</p>
            </div>
            <div className="flex justify-end">
                <Button
                    onClick={() => handleNavigation(slug)}
                    icon="pi pi-user"
                    label={over && !phone ? 'Ir al perfil' : ''}
                    onMouseOver={() => setOver(true)}
                    onMouseOut={() => setOver(false)} // Cambiado de onBlur a onMouseOut para manejar el evento de salida del mouse
                    className={` bg-gradient-to-r to-green-500 rounded-full hover:animation-gradient-x text-white ${over ? 'lg:md:w-36 w-8 lg:md:pl-4' : 'w-8 lg:md:w-12'} h-8 lg:md:h-12 from-emerald-500 transition-all`}
                />
            </div>
        </div>
    );
};

export default Header;
