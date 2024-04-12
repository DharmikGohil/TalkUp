"use client";

import MeetingTypeList from '@/components/MeetingTypeList';
import { useUser } from '@clerk/nextjs';
import React from 'react'

const Home = () => {
  
  const currenetDate = new Date();
  
    //for current time
    let hours = currenetDate.getHours();
    const minutes  = currenetDate.getMinutes();
    const ampm = hours>=12?'PM':'AM';
    hours = hours%12; //in 12 time formate
    hours = hours?hours:12;// o should be converted to 12
    //we show time in always two digit formate
    const paddingMinutes = minutes<10?'0'+minutes:minutes;
    const time = hours+":"+paddingMinutes+" "+ampm;


    //fore current date
    const weekdayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const weekdayIndex = currenetDate.getDay();
    const dayOfMonth = currenetDate.getDate();
    const monthIndex = currenetDate.getMonth();
    const year = currenetDate.getFullYear();


    const date = weekdayName[weekdayIndex]+","+" "+dayOfMonth +" "+monthName[monthIndex]+","+" "+year;



  //easy
  // const time = currenetDate.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
  // const date= (new Intl.DateTimeFormat('en-us',{dateStyle:'full'})).format(currenetDate);



  const {user} = useUser();
  console.log(user?.id);
  return (
    <section className='flex size-full flex-col gap-10 text-white '>
     <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>

      <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
        <h2 className=' max-w-[270px] rounded py-2 text-center text-base font-bold text-xl bg-dark-1'>Welcome {user.username}👋🏻</h2>

        <div className='flex flex-col gap-2'>
          <h1 className='text-4xl font-extrabold lg:text-7xl'>
            {time}
          </h1>
          <p className='text-lg font-medium text-sky-1 lg:text-2xl'>
            {date}
          </p>

        </div>
      </div>

     </div>
      
      <MeetingTypeList/>
    </section>
  )
}

export default Home
