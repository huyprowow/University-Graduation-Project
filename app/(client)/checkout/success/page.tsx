"use client";
import { useInvoice } from "@/hook/invoice";
import { Stack } from "@mui/material";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Success = () => {
  const router = useRouter();
  const { updateInvoice } = useInvoice();
  useEffect(() => {
    if (localStorage.getItem("invoice_Encode")) {
      const invoice = JSON.parse(
        atob(localStorage.getItem("invoice_Encode") as string)
      );
      console.log(invoice);
      updateInvoice({
        _id: invoice._id,
        address: invoice.address,
        quantity: invoice.quantity,
        email: invoice.email,
        product: invoice.product,
        paid: true,
      } as IInvoice);
    }
  }, []);
  const goHome = () => {
    router.push("/");
  };
  return (
    <Stack justifyContent={"center"} className="m-5" gap={2}>
      <h1 className="text-green-500 text-center">Payment success </h1>
      <Button onClick={goHome}>Home</Button>
    </Stack>
  );
};
export default Success;
