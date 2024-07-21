import { useBrand } from "@/hook/brand";
import { useCategory } from "@/hook/category";
import { CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { Button } from "@nextui-org/button";
import { Chip, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

interface IProps {
  closeForm: any;
  type: "CREATE" | "UPDATE";
  category?: ICategory;
}
const ToolCategory = (props: IProps) => {
  const [name, setName] = useState(
    props.category?.name ? props.category?.name : ""
  );
  const [brandSelected, setBrandSelected] = useState<string[]>(
    props.category?.brand
      ? (props.category?.brand as IBrand[]).map((i: IBrand) => i._id)
      : []
  );
  const { loading, createNewCategory, updateCategory, getCategory } =
    useCategory();
  const { brand } = useBrand();
  const handleChange = (prop:string) => (event:any) => {
    const { value, checked, files } = event.target;
    switch (prop) {
      case "name":
        setName(value);
        break;
      case "brand":
        setBrandSelected(value.split(","));
      default:
        break;
    }
  };
  const handleSubmit = (event:any) => {
    event.preventDefault();
    let res;

    if (props.type === "CREATE") {
      const category = {
        name: name,
        brand: brandSelected,
      };
      res = createNewCategory(category as any);
    } else {
      if (props.category === undefined) {
        return;
      }
      const category = {
        name: name,
        _id: props.category._id,
        brand: brandSelected,
      };
      res = updateCategory(category as any);
    }
    props.closeForm();
  };
  return (
    <>
      <Typography variant="h5" component="h5" textAlign={"center"}>
        {props.type === "UPDATE" ? "Edit Category" : "Add New Category"}
      </Typography>
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          required
          id="standard-required"
          label="Category Name"
          variant="standard"
          value={name}
          onChange={handleChange("name")}
        />
      </Stack>

      <Select
        items={brand}
        label="All Brand"
        variant="bordered"
        isMultiline={true}
        selectionMode="multiple"
        placeholder="Select a brand"
        labelPlacement="outside"
        classNames={{
          base: "max-w-xs",
          trigger: "min-h-12 py-2",
        }}
        selectedKeys={brandSelected}
        onChange={handleChange("brand")}
        renderValue={(items) => {
          return (
            <div className="flex flex-wrap gap-2">
              {items?.map((item) => (
                <Chip key={item.key}>{item?.data?.name}</Chip>
              ))}
            </div>
          );
        }}
      >
        {(brand) => (
          <SelectItem key={brand._id} textValue={brand.name}>
            <div className="flex gap-2 items-center">
              <div className="flex flex-col">
                <span className="text-small">{brand.name}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>

      <Button onClick={handleSubmit}>
        {loading ? (
          <CircularProgress size={24.5} color="success" />
        ) : props.type === "UPDATE" ? (
          "Edit "
        ) : (
          "Add"
        )}
      </Button>
    </>
  );
};

export default ToolCategory;
