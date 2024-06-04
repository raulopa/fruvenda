import React from 'react';
import { ProductManagementPanel } from '../../components';
import { Wrapper } from 'pages';

export default function ProductManagement() {
    return <div className=' bg-white dark:bg-slate-800'>
        <Wrapper page={<ProductManagementPanel />} />
    </div>;
}
