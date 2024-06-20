"use client";
import { useInvoice } from "@/hook/invoice";
import { Stack } from "@mui/material";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Cancel = () => {
  const router = useRouter();
  
  const goHome = () => {
    router.push("/");
  };
  return (
    <Stack justifyContent={"center"} className="m-5" gap={2}>
      <h1 className="text-red-500 text-center">Payment fail </h1>

      <Button onClick={goHome}>Home</Button>
    </Stack>
  );
};

export default Cancel;
