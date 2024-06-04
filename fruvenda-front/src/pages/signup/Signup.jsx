import React from 'react';
import PropTypes from 'prop-types';
import { RegisterForm } from '../../components';
import { Wrapper } from 'pages';

export default function Signup() {
    return <div className=' bg-white dark:bg-slate-800'>
        <Wrapper page={<RegisterForm />} />
    </div>;
}
