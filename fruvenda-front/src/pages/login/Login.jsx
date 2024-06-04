import PropTypes from 'prop-types';
import { LoginForm } from '../../components';
import { React, useState, useEffect } from 'react';
import { Wrapper } from 'pages';


export default function Login() {

    return <div className='relative h-full'>
        <Wrapper page={<LoginForm />} />
    </div>;
}
