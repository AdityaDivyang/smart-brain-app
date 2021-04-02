import React from 'react';
import Tilty from 'react-tilty';
import Brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            <Tilty className='Tilt br2 shadow-2' max={45}>
                <div className='pa3'><img style={{paddingBottom: '1px'}} alt='brain' src={Brain}/></div>
            </Tilty>
        </div>
    )
}

export default Logo;