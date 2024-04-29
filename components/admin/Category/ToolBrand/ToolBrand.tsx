import { useBrand } from "@/hook/brand";
import { CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { Button } from "@nextui-org/button";
import { useState } from "react";

interface IProps {
  closeForm: any;
  type: "CREATE" | "UPDATE";
  brand?: IBrand;
}
const ToolBrand = (props: IProps) => {
  const [name, setName] = useState(props.brand?.name ? props.brand?.name : "");
  const { loading, createNewBrand, updateBrand, getBrand } = useBrand();
  const handleChange = (prop) => (event) => {
    const { value, checked, files } = event.target;
    switch (prop) {
      case "name":
        setName(value);
        break;

      default:
        break;
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    let res;

    if (props.type === "CREATE") {
      const brand = {
        name: name,
      };
      res = createNewBrand(brand);
    } else {
      if (props.brand === undefined) {
        return;
      }
      const brand = {
        name: name,
        _id: props.brand._id,
      };
      res = updateBrand(brand);
    }
    props.closeForm();
  };
  return (
    <>
      <Typography variant="h5" component="h5" textAlign={"center"}>
        {props.type === "UPDATE" ? "Edit Brand" : "Add New Brand"}
      </Typography>
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          required
          id="standard-required"
          label="Brand Name"
          variant="standard"
          value={name}
          onChange={handleChange("name")}
        />
      </Stack>

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

export default ToolBrand;
