import React from 'react'

export default function () {
  return (
    <div className='flex flex-row justify-between items-center  border-b-2 px-2 py-1'>
        <div className="flex flex-row items-center">
            <img src="/src/assets/profile.png" alt="" className='h-10 w-10'/>
            <h1 className='font-semibold text-lg sm:text-2xl'>School CMS</h1>
        </div>
        <div className="">
            <img src="/src/assets/profile.png" alt="" className='h-8 w-8 border-2 rounded-full border-teal-200'/>
        </div>
    </div>
  )
}
