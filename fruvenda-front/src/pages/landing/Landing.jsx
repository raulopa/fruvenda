import React from 'react'
import { Wrapper } from 'pages';
import LandingContent from './landing-content/LandingContent';

export default function Landing() {

    return (<div>
        <Wrapper page={<LandingContent />} />
    </div>);
}