import React from 'react';
import { RegisterCommerceForm } from '../../components';
import { Wrapper } from 'pages';

export default function SignupCommerce() {
    return <div className=' bg-white dark:bg-slate-800'>
        <Wrapper page={<RegisterCommerceForm />} />
    </div>;
}
