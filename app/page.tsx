"use client";

import Banner from "@/components/home/Banner/Banner";
import CategoryList from "@/components/home/CategoryList/CategoryList";
import ProductList from "@/components/home/ProductList/ProductList";
import { useBrand } from "@/hook/brand";
import { useCategory } from "@/hook/category";
import { useProduct } from "@/hook/product";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import "./page.css";
interface ProtectedProps {
  session?: any; // Optional session type
}
async function getData() {
  const res = await fetch(process.env.NEXT_API_URL + "user/info");

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch user info");
  }

  return res.json();
}

export default function Home() {
  const { data: session } = useSession();
  const { product, getProduct, search } = useProduct();
  const { getBrand } = useBrand();
  const { getCategory } = useCategory();
  const { page, limit, query } = search;

  console.log(product);
  useEffect(() => {
    getCategory();
    getBrand();
  }, []);
  useEffect(() => {
    // getData();
    getProduct();
  }, [page, limit, query]);

  // if (!session) {
  //   return <></>;
  // }
  return (
    <>
      <Banner></Banner>
      <CategoryList></CategoryList>
      <ProductList></ProductList>
    </>
  );
}

// <div>
//   Welcome, {session.user?.name}! <br />
//   Your email: {session.user?.email}
// </div>
