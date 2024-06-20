import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Button as MUIButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";

import { useBrand } from "@/hook/brand";
import { useCategory } from "@/hook/category";
import { useProduct } from "@/hook/product";
import { Button } from "@nextui-org/button";
import { Chip, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import "./style.scss";
interface IProps {
  closeForm: any;
  type: "CREATE" | "UPDATE";
  product?: IProduct;
}
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const ToolProduct = (props: IProps) => {
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [name, setName] = useState(
    props.product?.name ? props.product?.name : ""
  );
  const [number, setNumber] = useState(
    props.product?.number ? props.product?.number : ""
  );
  const [price, setPrice] = useState(
    props.product?.price ? props.product?.price : ""
  );
  const [description, setDescription] = useState(
    props.product?.description ? props.product?.description : ""
  );
  const [status, setStatus] = useState(
    props.product?.status ? props.product?.status + "" == "true" : true
  );
  const [categorySelected, setCategorySelected] = useState(
    props.product?.category ? props.product?.category[0] : ""
  );
  const [brandSelected, setBrandSelected] = useState(
    props.product?.brand ? props.product?.brand[0] : ""
  );
  const [error, setError] = useState([]);
  // const [successMsg, setSuccessMsg] = useState('')
  const { brand } = useBrand();
  const { category } = useCategory();
  const { loading, createNewProduct, updateProduct } = useProduct();

  const [preview, setPreview] = useState(
    props.product?.image ? props.product?.image?.image_url : ""
  );
  const [previewModel, setPreviewModel] = useState(
    props.product?.model ? props.product?.model?.model_url : ""
  );
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!image) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);
  useEffect(() => {
    if (!model) {
      setPreviewModel(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(model);
    setPreviewModel(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [model]);
  const handleChange = (prop) => (event) => {
    const { value, checked, files } = event.target;
    switch (prop) {
      case "image":
        setImage(files[0]);
        break;
      case "model":
        setModel(files[0]);
        break;
      case "name":
        setName(value);
        break;
      case "number":
        setNumber(Number(value));
        break;
      case "price": {
        if (!isNaN(value)) {
          setPrice(value);
        }
        break;
      }
      case "description":
        setDescription(value);
        break;
      case "status":
        setStatus(checked);
        break;
      case "category":
        setCategorySelected(value);
      case "brand":
        setBrandSelected(value);
        break;
      default:
        break;
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(number, Number(price)!==0?Number(0):"", description, status, categorySelected, image, name);

    if (props.type === "CREATE") {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("model", model);
      formData.append("name", name);
      formData.append("number", number);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("status", status.toString());
      formData.append("category", categorySelected);
      formData.append("brand", brandSelected);
      await createNewProduct(formData);
    } else {
      const formData = new FormData();
      if (props.product === undefined) {
        return;
      }
      formData.append("_id", props?.product._id);
      formData.append("image", image);
      formData.append("model", model);
      formData.append("name", name);
      formData.append("number", number);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("status", status.toString());
      formData.append("category", categorySelected);
      formData.append("brand", brandSelected);
      await updateProduct(formData);
    }
    props.closeForm();
  };
  return (
    <>
      <Typography
        variant="h5"
        component="h5"
        textAlign={"center"}
        className="pt-5"
      >
        {props.type === "UPDATE"
          ? "Edit Product"
          : "Do you want add some thing new?"}
      </Typography>
      <Stack direction="column" className="h-full " id="tool_product-content">
        <form onSubmit={handleSubmit} className="grow gap-2 justify-evenly ">
          <Stack className="mb-2" direction="row" spacing={2}>
            <Input
              isRequired
              label="Product Name"
              variant="standard"
              value={name}
              onChange={handleChange("name")}
            />
          </Stack>
          <Stack
            className="mb-2"
            direction="row"
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <Select
              items={category}
              label="All category"
              placeholder="Select a category"
              classNames={{
                base: "max-w-xs",
                trigger: "min-h-12 py-2",
              }}
              selectedKeys={[categorySelected]}
              onChange={handleChange("category")}
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
              {(category) => (
                <SelectItem key={category._id} textValue={category.name}>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col">
                      <span className="text-small">{category.name}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
            <Select
              isDisabled={categorySelected === ""}
              items={
                categorySelected !== ""
                  ? category.filter((c) => c._id === categorySelected)[0].brand
                  : brand
              }
              label="All Brand"
              placeholder="Select a brand"
              classNames={{
                base: "max-w-xs",
                trigger: "min-h-12 py-2",
              }}
              selectedKeys={[brandSelected]}
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
            <Box
              sx={{
                display: "flex",
                // justifyContent: "space-evenly",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    value={status}
                    onChange={handleChange("status")}
                  />
                }
                label="OnSale?"
              />
            </Box>
          </Stack>
          <Stack className="mb-2" direction="row" spacing={2}>
            <FormControl variant="standard" fullWidth>
              <Input
                isRequired
                value={number}
                label="Number*"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={handleChange("number")}
              />
            </FormControl>
            <FormControl variant="standard" fullWidth>
              <Input
                isRequired
                value={price}
                onKeyPress={(event) => {
                  if (!/^([0-9]{1,})?(\.)?([0-9]{1,})?$/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={handleChange("price")}
                label="Price*"
                placeholder="0.00"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
              />
            </FormControl>
          </Stack>
          <Stack className="mb-2" direction="column" spacing={2}>
            <Textarea
              fullWidth
              label="Description?..."
              multiline
              rows={6}
              value={description}
              onChange={handleChange("description")}
            />
          </Stack>
          <Stack
            className="mb-2 grow"
            direction="row"
            spacing={2}
            sx={{ height: "calc(100% - 400px)" }}
          >
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <MUIButton
                  component="label"
                  role={undefined}
                  variant="contained"
                  className="mb-2"
                  tabIndex={-1}
                  startIcon={<AddAPhotoIcon />}
                >
                  Upload Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    id="icon-button-file"
                    required={props?.type === "UPDATE"?false:true}
                    onChange={handleChange("image")}
                  />
                </MUIButton>
                {(image || (props?.type === "UPDATE" && preview)) && (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxWidth: 700, maxHeight: 450 }}
                  />
                )}
              </Grid>
              <Grid item xs={6} className="h-full">
                <MUIButton
                  component="label"
                  className="mb-2"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<AddAPhotoIcon />}
                >
                  Upload model
                  <VisuallyHiddenInput
                    type="file"
                    accept=".glb,.gltf"
                    id="icon-button-file"
                    onChange={handleChange("model")}
                  />
                </MUIButton>
                {(model || (props?.type === "UPDATE" && previewModel)) && (
                  <model-viewer
                    // src="uploads/2015_mercedes-amg_gt3.glb"
                    src={previewModel}
                    ar
                    // environment-image="shared-assets/environments/moon_1k.hdr"
                    // poster="shared-assets/models/NeilArmstrong.webp"
                    shadow-intensity="1"
                    camera-controls
                    touch-action="pan-y"
                    alt="Preview model"
                  ></model-viewer>
                )}
              </Grid>
            </Grid>
          </Stack>
          <Grid container>
            <Grid item xs={10}>
              {error &&
                error.map((err, i) => (
                  <span className="msg-error" key={i}>
                    {err}
                    <ClearIcon fontSize="sm" />
                  </span>
                ))}
            </Grid>

            <Grid item xs={2}>
              <Button type="submit" className="float-right">
                {loading ? (
                  <CircularProgress size={24.5} color="success" />
                ) : props?.type === "UPDATE" ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
};

export default ToolProduct;
