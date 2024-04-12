import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react"

//this is resusable hooks by which we got upcoming calls, ended calls, recordings
export const useGetCalls = () =>{
    const [calls,setCalls] = useState<Call[]>([]);
    const [isLoading,setIsLoading] = useState(false);

    const client = useStreamVideoClient();
    const {user} = useUser();


    useEffect(()=>{
        const loadCalls = async () =>{ //it can gets meetings calls async
                if(!client || !user?.id) return;

                setIsLoading(true); //now we starting to fetching call and loading happnes

                try {

                    const {calls} = await client.queryCalls({
                        sort:[{field:'starts_at',direction:-1}], //syntax coming from stream getting client
                        filter_conditions:{
                            starts_at:{$exists:true},
                            $or:[
                                {created_by_user_id:user.id}, //we shwo meeting list only if we created
                                {members:{$in:[user.id]}}, //or onny if we are participatants in thta meeings

                            ]
                        } 
                    }); //geting from streamvideo 

                    setCalls(calls);
                    
                } catch (error) {
                    
                    console.log(error)
                }finally{
                    setIsLoading(false); //whether is not fetch ot fetch is always stop loading circle
                }

        }
        loadCalls();

    },[client,user?.id]) ///we can fetch meeting status for deferent users 

    const now = new Date(); //if it after now is it upcoming 
                            //if is before now ir is ended

    //to make this hooks reusable we return 
    const endedCalls = calls.filter(({state:{startsAt,endedAt}}:Call)=>{
        return (startsAt && new Date(startsAt)<now || !!endedAt) //!! means it is already ended 
    })
    const upcomingCalls = calls.filter(({state:{startsAt}}:Call)=>{
        return startsAt && new Date(startsAt)>now  // it means this is an upcoming call 
    })

    return{
        endedCalls,
        upcomingCalls,
        callRecordings : calls,
        isLoading
    }

}