import { useProductStore } from "@/store/product";
import { useSearchStore } from "@/store/search";
import { useState } from "react";

export const useProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { search, setSearch } = useSearchStore();
  const {
    product,
    setProduct,
    setCountProduct,
    currentProduct,
    similarProduct,
    setCurrentProduct,
    setSimilarProduct,
    countProduct,
  } = useProductStore((state) => state);
  const createNewProduct = async (newProductFormData: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/product", {
        method: "POST",
        body: newProductFormData,
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

  const updateProduct = async (updateProductFormData: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/product", {
        method: "PUT",
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
      const { page, limit, query,category,brand } = search;

      const response = await fetch(
        `/api/product?page=${page}&limit=${limit}&query=${query ?? ""}&category=${category?? ""}&brand=${brand?? ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        const data = await response.json();
        setProduct(data.data);
        setCountProduct(data.count);
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
        setCurrentProduct(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getSimilarProductById = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/product/${id}/similar`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        const data = await response.json();
        setSimilarProduct(data.data);
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
        getProduct();
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
    countProduct,
    currentProduct,
    similarProduct,
    setLoading,
    updateProduct,
    getProduct,
    createNewProduct,
    deleteProduct,
    getProductById,
    getSimilarProductById,
    search,
    setSearch,
  };
};
