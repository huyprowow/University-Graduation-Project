import { useInvoiceStore } from "@/store/invoice";
import { useState } from "react";

export const useInvoice = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { invoice, setInvoice, currentInvoice, setCurrentInvoice } =
    useInvoiceStore((state) => state);
  const createNewInvoice = async (
    newInvoice: Omit<IInvoice, "_id">,
    callback: any,
    currentProduct: any
  ) => {
    const response = await fetch("/api/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInvoice),
    });
    if (response) {
      const data = await response.json();
      console.log(data);
      if (data.data._id && callback) {
        localStorage.setItem(
          "invoice_Encode",
          data.data._id ? btoa(JSON.stringify(data.data)) : ""
        );
        callback(data, currentProduct);
      }
      // getInvoice();
    }
  };

  const updateInvoice = async (updateInvoice: IInvoiceRequest, type = "") => {
    try {
      setLoading(true);
      const response = await fetch("/api/invoice", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateInvoice),
      });
      if (response) {
        const data = await response.json();
        console.log(data);
        if (type == "pay") {
          localStorage.removeItem("invoice_Encode");
        }
        getInvoice();
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const getInvoice = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/invoice", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        const data = await response.json();
        console.log(data);
        setInvoice(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (invoice: IInvoice) => {
    try {
      setLoading(true);
      const response = await fetch("/api/invoice", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: invoice._id,
        }),
      });
      if (response) {
        const data = await response.json();
        console.log(data);
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    invoice,
    setLoading,
    updateInvoice,
    getInvoice,
    createNewInvoice,
    deleteInvoice,
  };
};
