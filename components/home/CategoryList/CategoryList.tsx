"use client";
import { useBrand } from "@/hook/brand";
import { useCategory } from "@/hook/category";
import { useProduct } from "@/hook/product";
import { mobileAndTabletCheck } from "@/utils/utils";
import { Divider, Stack } from "@mui/material";
import { Button, ScrollShadow } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CategoryList = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const isMb = mobileAndTabletCheck();
    setIsMobile(isMb);
  }, []);
  const { brand } = useBrand();
  const { category } = useCategory() ;
  const { search, setSearch } = useProduct();
  const router = useRouter();
  const handleCategorySelect = (id:string) => {
    setSearch({ ...search, category: id });
    router.push("/product?search=&category=" + id);

  };

  return (
    <ScrollShadow
    hideScrollBar={isMobile ? true : false}
      offset={100}
      orientation="horizontal"
      className="max-w-[400px] max-h-[300px]"
      style={{
        margin: "0 auto",
        marginBottom: "2.5rem" /* 40px */
      }}
    >
      <Stack direction="row" className="justify-around">
        {category?.map((category) => (
          <Stack key={category._id}>
            <Button
              className="w-[100px] h-[100px] rounded-full p-0"
              id="button_category"
              onClick={()=>handleCategorySelect(category._id)}
            >
              {category.name}
            </Button>
            <Divider flexItem />
          </Stack>
        ))}
      </Stack>
    </ScrollShadow>
  );
};

export default CategoryList;
