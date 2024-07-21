"use client";
import SideBar from "@/components/admin/Sidebar/SideBar";
import { useBrand } from "@/hook/brand";
import { useCategory } from "@/hook/category";
import { useProduct } from "@/hook/product";
import { useEffect } from "react";

export default function AdminLayout({ children }: any) {
  const { brand, getBrand } = useBrand();
  const { category, getCategory } = useCategory();
  const { product, getProduct, search, setSearch } = useProduct();
  const { page, limit, query } = search;
  useEffect(() => {
    getBrand();
    getCategory();
  }, []);
  useEffect(() => {
    getProduct();
  }, [page, limit, query]);
  return (
    <div className="flex overflow-hidden h-min">
      <SideBar />
      <main className="overflow-auto w-full p-2">{children}</main>
    </div>
  );
}
