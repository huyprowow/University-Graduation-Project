import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Button as MUIButton,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import { Button } from "@nextui-org/button";
import "./style.scss";
interface IProps {
  closeForm: any;
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
const AddProduct = (props: IProps) => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [type, setType] = useState("");
  const [error, setError] = useState([]);
  // const [successMsg, setSuccessMsg] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState();

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
  const handleChange = (prop) => (event) => {
    const { value, checked, files } = event.target;
    switch (prop) {
      case "image":
        setImage(files[0]);
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
      case "type":
        setType(value);
        break;
      default:
        break;
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(number, Number(price)!==0?Number(0):"", description, status, type, image, name);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("number", number);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("status", status.toString());
    formData.append("type", type);
    fetch("/product/add", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res.data);
        if (res.status === 201) {
          setIsLoading(false);

          props.closeForm();
          // del dung dc do up load file len thu muc o frontend nen no reload :v neu day len ec2 cua amazon thi lai ngon r :v
          // setSuccessMsg(res.data.message);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.response?.data);
        if (err.response?.data) {
          let errList = err.response?.data;
          let errMsgList = errList.errors.map((err) => err.msg);
          setError(errMsgList);
          setIsLoading(false);
        }
      });
  };
  return (
    <>
      <Typography variant="h5" component="h5" textAlign={"center"}>
        Do you want add some thing new?
      </Typography>
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          required
          id="standard-required"
          label="Product Name"
          variant="standard"
          value={name}
          onChange={handleChange("name")}
        />
        <TextField
          required
          fullWidth
          id="standard-required"
          label="Type"
          variant="standard"
          value={type}
          onChange={handleChange("type")}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <FormControl variant="standard" fullWidth>
          <InputLabel htmlFor="standard-adornment-number">Number*</InputLabel>
          <Input
            required
            id="standard-adornment-number"
            value={number}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            onChange={handleChange("number")}
          />
        </FormControl>
        <FormControl variant="standard" fullWidth>
          <InputLabel htmlFor="standard-adornment-price">Price*</InputLabel>
          <Input
            required
            id="standard-adornment-price"
            value={price}
            onKeyPress={(event) => {
              if (!/^([0-9]{1,})?(\.)?([0-9]{1,})?$/.test(event.key)) {
                event.preventDefault();
              }
            }}
            onChange={handleChange("price")}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          sx={{
            width: "100%",
          }}
          id="standard-multiline-description"
          label="Description?..."
          multiline
          rows={6}
          variant="standard"
          value={description}
          onChange={handleChange("description")}
        />
        <Stack
          direction="column"
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
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
            <MUIButton
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<AddAPhotoIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                id="icon-button-file"
                onChange={handleChange("image")}
              />
            </MUIButton>
          </Box>
          {image && (
            <img src={preview} alt="Preview" width={200} height={100} />
          )}
        </Stack>
      </Stack>
      {/* <Stack direction="row" spacing={2}>*/}
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
          <Button onClick={handleSubmit}>
            {isLoading ? (
              <CircularProgress size={24.5} color="success" />
            ) : (
              "Add"
            )}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AddProduct;
