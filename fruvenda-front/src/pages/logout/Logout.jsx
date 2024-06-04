import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthService from 'services/auth-service/UseAuthService';

const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useAuthService();
    useEffect(() => {
        logout().then((response)=> {
            localStorage.removeItem('commerceToken');
            localStorage.removeItem('token');
            sessionStorage.removeItem('entityType');
            navigate('/login');
        });
    }, [navigate]);

    return (
        <div>
            <p>Cerrando sesión...</p>
        </div>
    );
};

export default Logout;