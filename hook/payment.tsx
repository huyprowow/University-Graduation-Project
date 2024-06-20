import { useState } from "react";
import { useInvoice } from "./invoice";

export const usePayment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { updateInvoice } = useInvoice();

  const checkoutProduct = async (product: IProduct) => {
    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (response) {
      const paymentData = await response.json();
      console.log({ paymentData });
      return paymentData;
    }
    return null;
  };

  return {
    loading,
    checkoutProduct,
  };
};
