"use client";

import { useSession } from "next-auth/react";

const Admin = () => {
  const { data: session } = useSession();

  console.log(session);
  return <h1>Overview</h1>;
};

export default Admin;
