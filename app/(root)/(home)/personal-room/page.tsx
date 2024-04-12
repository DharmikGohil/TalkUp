"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from "react";

//now lets create our own function that accepts some parameters ans return div
//truncate is cut it out description if it is too long
const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-start gap-2 xl:flex-row">
    <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
      {title}:
    </h1>
    <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
      {description}
    </h1>
  </div>
);

const PersonalRoom = () => {
  const { user } = useUser();
  //since this is personal room so our meeting id is our user id
  const meetingID = user?.id;
  //meeting link

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingID}?personal=true`;

  const client = useStreamVideoClient();
  //navigate to that link
  const router = useRouter();


  const {call} = useGetCallById(meetingID!);
  const startRoom = async () =>{

    if(!client || !user) return ;
    //if no call so we creater new call for it
    if(!call){
          const newCall = client.call('default',meetingID!)
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }
    router.push(`/meeting/${meetingID}?personal=true`)


  }
  return (
    <section className="flex size-full flex-col gap-10 text-white ">
      <h1 className="text-3xl font-bold">
        Personal Room
      </h1>

      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">

      <Table title="Topic" description={`${user?.username}'s Meeting Room`} />
      <Table title="Meeting ID" description={meetingID!} />
      <Table title="Invite Link" description={meetingLink} />
      </div>

      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button className="bg-dark-3" onClick={()=>{
          navigator.clipboard.writeText(meetingLink);
          toast({
            title:"Linked Copied Successful"
          })
        }}>
          Copy Invitation Link

        </Button>

      </div>
    </section>
  );
};

export default PersonalRoom;