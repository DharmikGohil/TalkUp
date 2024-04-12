"use client" //directive

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import {
    StreamVideo,
    StreamVideoClient,
    
  } from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';
  
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
//   const userId = 'user-id';
//   const token = 'authentication-token';
//   const user: User = { id: userId };
  
 
  
const StreamVideoProvider = ({children}:{children:ReactNode}) => {

    const [videoClient, setVideoClient] = useState<StreamVideoClient>();

    //lets get currently looged user from clerk
    const {user,isLoaded} = useUser(); //this is coming from clerk next js

    useEffect(()=>{

        if(!isLoaded || !user) return; //if user not login or exists 

        if(!apiKey) throw new Error("Stream API Key is missing")
        //if user is login so now lets create it stream video client 
        //we create function StreamVideoClient  of object which has several options
        const client = new StreamVideoClient({
            apiKey,
            user:{
                id:user?.id,//getting from clerk
                name:user?.username || user?.id, //if user has no username so id assign to name
                image:user?.imageUrl,
            },
            tokenProvider, //we get token from each logged user form stream.actions.ts
        })
        setVideoClient(client);

    },[user,isLoaded]); //if [] value changed so this function is again called

    if(!videoClient) return <Loader/> //if we have no video client we return loader component

    return (
      <StreamVideo client={videoClient}>
       {children}
      </StreamVideo>
    );
  };

export default StreamVideoProvider;