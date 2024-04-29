import { useProductStore } from "@/store/product";
import { useState } from "react";

export const useProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { product, setProduct } = useProductStore((state) => state);
  const createNewProduct = async (newProductFormData: any) => {
    const response = await fetch("/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: newProductFormData,
    });
    if (response) {
      const data = await response.json();
      console.log(data);
      getProduct();
    }
  };

  const updateProduct = async (updateProductFormData: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/product", {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: updateProductFormData,
      });
      if (response) {
        const data = await response.json();
        console.log(data);
        getProduct();
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/product", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        const data = await response.json();
        console.log(data);
        setProduct(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getProductById = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/product/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        const data = await response.json();
        console.log(data);
        setProduct(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (product: IProduct) => {
    try {
      setLoading(true);
      const response = await fetch("/api/product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: product._id,
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
    product,
    setLoading,
    updateProduct,
    getProduct,
    createNewProduct,
    deleteProduct,
  };
};
