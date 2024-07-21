import { useBrand } from "@/hook/brand";
import { useCategory } from "@/hook/category";
import { useProduct } from "@/hook/product";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { Drawer, IconButton } from "@mui/material";
import { Radio, RadioGroup } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
const Filter = () => {
  const { category, currentCategory, setCurrentCategory } = useCategory();
  const { brand, currentBrand, setCurrentBrand } = useBrand();
  const { search, setSearch } = useProduct();
  const { query } = search;

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const onFilterCategory = (categoryId: string) => {
    setSearch({ ...search, category: categoryId });
    if (categoryId !== "") {
      setCurrentCategory({ _id: categoryId } as ICategory);
    } else {
      setCurrentCategory({} as ICategory);
    }
    router.push("/product?search=&category=" + categoryId);
  };
  const onFilterBrand = (brandId: string) => {
    setSearch({ ...search, brand: brandId });
    router.push(
      "/product?search=" +
        query +
        "&category=" +
        currentCategory._id +
        "&brand=" +
        brandId
    );
  };
  return (
    <>
      <IconButton
        color="secondary"
        aria-label="open filter"
        onClick={toggleDrawer(true)}
      >
        <WidgetsIcon />
      </IconButton>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            padding: 1,
            boxSizing: "border-box",
          },
        }}
      >
        <RadioGroup
          label="Select Category"
          value={currentCategory._id ? currentCategory._id : ""}
          onChange={(e) => onFilterCategory(e.target.value)}
          color="secondary"
        >
          <Radio key={""} value={""}>
            All
          </Radio>
          {category?.map((item) => (
            <Radio key={item._id} value={item._id}>
              {item.name}
            </Radio>
          ))}
        </RadioGroup>
        {currentCategory._id ? (
          <RadioGroup
            label="Select Brand"
            value={currentBrand._id ? currentBrand._id : ""}
            color="secondary"
            onChange={(e) => onFilterBrand(e.target.value)}
          >
            <Radio key={""} value={""}>
              All
            </Radio>
            {(currentCategory._id
              ? category?.filter((c) => c._id === currentCategory._id)[0]?.brand
              : brand
            )?.map((item) => (
              <Radio key={item._id} value={item._id}>
                {item.name}
              </Radio>
            ))}
          </RadioGroup>
        ) : null}
      </Drawer>
    </>
  );
};

export default Filter;
