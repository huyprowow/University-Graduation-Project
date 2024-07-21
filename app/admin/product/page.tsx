"use client";
import ProductTable from "@/components/admin/Product/ProductTable/ProductTable";
import { useProduct } from "@/hook/product";
import { useEffect } from "react";

const Product = () => {
  const { product, getProduct, search, setSearch } = useProduct();
  const { page, limit, query } = search;
  useEffect(() => {
    setSearch({ ...search, limit: 5 });
  }, []);
  return (
    <>
      <ProductTable />
    </>
  );
};

export default Product;
