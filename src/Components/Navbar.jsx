import React from 'react';
import ERP from '../assets/Logo.avif';
import Framer from '../Frames/Framer';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <Framer>
      <div className='flex flex-col justify-center items-center pt-32'>
        <nav className='fixed wrapper top-0 z-50 flex items-center  gap-2 py-6 w-[1280px] max-[768px]:w-[700px]'>
          <div
            className='flex w-full justify-between mx-auto bg-secondary/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-primary/10 p-6 rounded-2xl'
            style={{ opacity: 1, willChange: 'auto', transform: 'none' }}
          >
            <a className='flex items-center gap-2 cursor-pointer'>
              <img
                alt='Logo'
                width='300'
                height='200'
                decoding='async'
                className='rounded-full size-10'
                src={ERP}
                style={{ color: 'transparent' }}
              ></img>
              <span className='text-lg md:text-2xl  font-bold tracking-tight text-foreground md:block'>
                ERP System
              </span>
            </a>

            <div className='flex items-center gap-8'>
            <Link to='/Login'>
              <button className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-8 '>
                Login
              </button>
            </Link>
            </div>
          </div>
        </nav>
      </div>
    </Framer>
  );
}

export default Navbar;