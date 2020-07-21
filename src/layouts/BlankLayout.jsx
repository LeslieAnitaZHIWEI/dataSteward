import React from 'react';
import back from '../assets/back.png'
const Layout = ({ children }) => <div style={{height:'100%',overflow:'hidden'}}>
    {children}
    <img style={{width:'100%',height:'100%'}} src={back} alt=""/>
    </div>;

export default Layout;
