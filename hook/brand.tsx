import { useBrandStore } from "@/store/brand";
import { useState } from "react";

export const useBrand = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { brand, setBrand } = useBrandStore((state) => state);
  const createNewBrand = async (newBrand: Omit<IBrand, "_id">) => {
    const response = await fetch("/api/brand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBrand),
    });
    if (response) {
      const data = await response.json();
      console.log(data);
      getBrand();
    }

  };

  const updateBrand = async (updateBrand: IBrand) => {
    try {
      setLoading(true);
      const response = await fetch("/api/brand", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateBrand),
      });
      if (response) {
        const data = await response.json();
        console.log(data);
        getBrand();
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }

  };

  const getBrand = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/brand", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        const data = await response.json();
        console.log(data);
        setBrand(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (brand: IBrand) => {
    try {
      setLoading(true);
      const response = await fetch("/api/brand", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: brand._id,
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
    brand,
    setLoading,
    updateBrand,
    getBrand,
    createNewBrand,
    deleteBrand,
  };
};
