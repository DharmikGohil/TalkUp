
"use client"

import { useGetCalls } from '@/hooks/useGetCall'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import { Loader } from 'lucide-react';
import { useToast } from './ui/use-toast';


const CallList = ({type}:{type:'ended'|'upcoming'|'recordings'}) => {

    const {endedCalls,upcomingCalls,callRecordings,isLoading} = useGetCalls();

    //now lets figure out that on which router that we currently now
    const router = useRouter();

    const [recordings, setRecordings] = useState<CallRecording[]>([]);

    const {toast} = useToast();
    
    const getCalls = () =>{
        switch (type) {
            case 'ended':     
                return endedCalls;
        
            case 'recordings':
                return recordings;
            
            case 'upcoming':
                return upcomingCalls;
            
            default:
                return [];
        }
    }

    //if don't have anything above 
    const getNoCallsMessage = () =>{
        switch (type) {
            case 'ended':     
                return 'No Previous Calls';
        
            case 'recordings':
                return 'No Recordings Are Available';
            
            case 'upcoming':
                return 'No Upcoming Calls';
            
            default:
                return '';
        }
    }
    //useEffect for fetching recordings

    useEffect(()=>{
        

        const fetchRecordings = async () =>{

            try {
                
                //first lets get access to this meeting in which user are in
                const callData = await Promise.all(callRecordings.map((meeting)=>meeting.queryRecordings())) //this from stream which gives us all recordings 
                
                //now lets extract that recordings from callData
                //flatMap() 
                //[['rec1','rec2'],['rec3]] if same meeting has different recording 
                //flatMap() can put into one single array
                //['rec1','rec2','rec3']
                const recordings = callData
                    .filter(call=>call.recordings.length>0) //recordings attach to it
                    .flatMap(call=>call.recordings)
    
                    setRecordings(recordings);
            } catch (error) {
                toast({title:'Try Again Later Because of Too Many Requests'})
                
            }
                

        }
        if(type==='recordings') fetchRecordings();

    },[type,callRecordings]);

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    if(isLoading) return <Loader/> 

return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === 'ended'
                ? '/icons/previous.svg'
                : type === 'upcoming'
                  ? '/icons/upcoming.svg'
                  : '/icons/recordings.svg'
            }
            title={
              (meeting as Call).state?.custom?.description ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              'No Description'
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            isPreviousMeeting={type === 'ended'}
            link={
              type === 'recordings'
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
            }
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Play' : 'Start'}
            handleClick={
              type === 'recordings'
                ? () => window.open(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  );
}

export default CallList
