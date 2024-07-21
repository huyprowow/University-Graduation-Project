"use client";
import ProductList from "@/components/home/ProductList/ProductList";
import Filter from "@/components/product/Filter/Filter";
import { useBrand } from "@/hook/brand";
import { useCategory } from "@/hook/category";
import { useProduct } from "@/hook/product";
import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
const Product = () => {
  const searchParam = useSearchParams();
  const valueSearch = searchParam.get("search") ?? "";
  const valueCategory = searchParam.get("category") ?? "";
  const valueBrand = searchParam.get("brand") ?? "";
  const { search, setSearch } = useProduct();
  const { category, getCategory, currentCategory, setCurrentCategory } =
    useCategory();
  const { brand, getBrand, currentBrand, setCurrentBrand } = useBrand();
  useEffect(() => {
    getCategory();
    getBrand();
  }, []);
  useEffect(() => {
    setSearch({
      ...search,
      query: valueSearch,
      category: valueCategory,
      brand: valueBrand,
    });
  }, [valueSearch, valueBrand, valueCategory]);

  useEffect(() => {
    setCurrentCategory({
      _id: valueCategory,
    } as ICategory);
  }, [valueCategory]);
  useEffect(() => {
    setCurrentBrand({
      _id: valueBrand,
    } as IBrand);
  }, [valueBrand]);
  return (
    <>
      <Filter />
      <Typography
        variant="h6"
        className="inline-block text-slate-400  align-middle"
      >
        <span className="p-1  underline decoration-pink-600 decoration-3 underline-offset-7 ">
          {
            category?.filter((x) => {
              return x._id === currentCategory._id;
            })[0]?.name
          }
        </span>
        {currentBrand._id ? " of " : null}

        <span className="p-1  underline decoration-pink-600 decoration-3 underline-offset-7 ">
          {
            brand?.filter((x) => {
              return x._id === currentBrand._id;
            })[0]?.name
          }
        </span>
      </Typography>
      <ProductList></ProductList>
    </>
  );
};

export default Product;
