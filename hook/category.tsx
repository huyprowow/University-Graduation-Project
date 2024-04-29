import { useCategoryStore } from "@/store/category";
import { useState } from "react";

export const useCategory = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { category, setCategory } = useCategoryStore((state) => state);
  const createNewCategory = async (newCategory: Omit<ICategory, "_id">) => {
    const response = await fetch("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCategory),
    });
    if (response) {
      const data = await response.json();
      console.log(data);
      getCategory();
    }
  };

  const updateCategory = async (updateCategory: ICategory) => {
    try {
      setLoading(true);
      const response = await fetch("/api/category", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateCategory),
      });
      if (response) {
        const data = await response.json();
        console.log(data);
        getCategory();
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        const data = await response.json();
        console.log(data);
        setCategory(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (category: ICategory) => {
    try {
      setLoading(true);
      const response = await fetch("/api/category", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: category._id,
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
    category,
    setLoading,
    updateCategory,
    getCategory,
    createNewCategory,
    deleteCategory,
  };
};
