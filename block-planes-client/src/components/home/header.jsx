import React from 'react';
import { Link } from 'react-router-dom'

const Header = () => (
    <header>
        Welcome to BlockPlanes
        <nav>
            <ul>
                <li><Link to='/home'>Home</Link></li>
                <li><Link to='/profile'>Profile</Link></li>
                <li><Link to='/game'>Game</Link></li>
                <li><Link to='/login'>Login</Link></li>
            </ul>

        </nav>

    </header>
)

export default Header;