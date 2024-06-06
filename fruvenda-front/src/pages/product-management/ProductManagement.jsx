import React, { useEffect } from 'react';
import { ProductManagementPanel } from '../../components';
import { Wrapper } from 'pages';
import { useNavigate } from 'react-router-dom';

export default function ProductManagement() {
    let navigation = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem('entityType') != '1' && !localStorage.getItem('commerceToken')) {
            navigation('/login');
        }
    }, [])

    return <div className=' bg-white dark:bg-slate-800'>
        <Wrapper page={<ProductManagementPanel />} />
    </div>;
}
