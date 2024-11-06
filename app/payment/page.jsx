import React from 'react'
import Paybill from '@/components/payment/paybill';
import Navbar from '@/components/common/navbar/Navbar';
function page() {
  return (
    <div >
        <Navbar/>
        <div className=' w-full bg-slate-100'>
        <div className=' justify-center flex ml-[250px] mr-[250px]'>
        <Paybill/>
        </div>
        </div>
       
       
    </div>
  )
}

export default page