import { useBrand } from "@/hook/brand";
import { useCategory } from "@/hook/category";
import { useProduct } from "@/hook/product";
import { Divider, Stack } from "@mui/material";
import { Button, ScrollShadow } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const CategoryList = () => {
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
      hideScrollBar
      offset={100}
      orientation="horizontal"
      className="max-w-[400px] max-h-[300px]"
      style={{
        margin: "0 auto",
      }}
    >
      <Stack direction="row" className="justify-around">
        {category?.map((category) => (
          <Stack key={category._id}>
            <Button
              className="w-[100px] h-[100px] rounded-full p-0 mb-10"
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
