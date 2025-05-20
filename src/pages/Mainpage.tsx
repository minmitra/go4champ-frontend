import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuthenti } from '../context/AuthentiContext';

const Mainpage = () => {
    const { isAuthenticated } = useAuthenti();

    return (
    <>
    <Navigation />
    <main>
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold"></h1>
        {isAuthenticated ? 'Welcome back!' : 'You are logged in'}
      </div>
    </main>
      </>

    );
  };
  
  export default Mainpage;
  