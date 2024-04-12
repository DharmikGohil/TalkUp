"use client"

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const EndCallButton = () => {

    const call = useCall();
    //we have to get home router access after ending call
    const router = useRouter();

    const {useLocalParticipant} = useCallStateHooks();
    const localParticipant = useLocalParticipant();
    
    //checking id of the owner to the same to the current participant
    const isMeetingOwner = localParticipant && call?.state.createdBy && localParticipant.userId === call.state.createdBy.id;

    if(!isMeetingOwner) return null; //if not meeting owner so don't show the endcall button


  return (
    <div>
      <Button onClick={async()=>{
        await call.endCall();
        router.push('/'); //sending to home page after ending call 
      }}  className='bg-red-500'>
        End Call For Everyone
      </Button>
    </div>
  )
}

export default EndCallButton
