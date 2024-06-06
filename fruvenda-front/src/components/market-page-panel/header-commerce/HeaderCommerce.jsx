import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const Header = ({ nombre, foto_perfil, slug}) => {
    let navigation = useNavigate();
    const [over, setOver] = useState(false);
    const handleNavigation = (slug) => {
        navigation(`/profile/${slug}`)
    }
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                <img src={foto_perfil} alt={foto_perfil} className="w-24 h-24 rounded-full mr-10" />
                <p className="text-aureus-l">{nombre}</p>
            </div>
            <div className="flex justify-end">
                <Button
                    onClick={() => handleNavigation(slug)}
                    icon="pi pi-user"
                    label={over ? 'Ir al perfil' : ''}
                    onMouseOver={() => setOver(true)}
                    onMouseOut={() => setOver(false)} // Cambiado de onBlur a onMouseOut para manejar el evento de salida del mouse
                    className={` bg-gradient-to-r to-green-500 rounded-full hover:animation-gradient-x text-white ${over ? 'w-36 pl-4' : 'w-12'} h-12 from-emerald-500 transition-all`}
                />
            </div>
        </div>
    );
};

export default Header;
