import React, { useState } from 'react'
import DownArrow from '../assets/Down_arrow.png'
function LoginDetails() {

  const [Drop , setDrop] = useState(false);
  return (
    <>
    <div className='flex flex-col justify-center items-center  w-3/4  shadow-lg rounded-md px-2 py-2 border border-grey-100 mt-10'>
        <div className='flex justify-center items-center gap-60 w-full ' 
         onClick={()=>setDrop(!Drop)}
        >
           <h1 className='mr-auto'>Important Details</h1> 
           <img alt = 'Arrow' src={DownArrow} className={`w-10 h-10 transition-transform duration-300 ${
            Drop ? 'rotate-180' : ''
          }`} />
        </div>

        <div
        className={`overflow-hidden transition-all duration-300 ${
          Drop ? 'max-h-40' : 'max-h-0'
        }`}
      >
        <div className="p-4">
          <p>
            Here are the details you need to know! This section expands and collapses with an animation.
          </p>
        </div>
      </div>

      </div>
    </>
  )
}

export default LoginDetails