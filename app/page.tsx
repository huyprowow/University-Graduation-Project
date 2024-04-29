"use client";
import { User } from "next-auth"; // Import the User type for type safety
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface ProtectedProps {
  session?: User; // Optional session type
}
async function getData() {
  const res = await fetch(process.env.NEXT_API_URL+'user/info')
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch user info')
  }
 
  return res.json()
}
export default function Home() {
  const { data: session } = useSession();

  // useEffect(()=>{
  //   getData()
  // },[])

  if (!session) {
    return <></>;
  }

  return (
    <div>
      Welcome, {session.user?.name}! <br />
      Your email: {session.user?.email}
    </div>
  );
}
