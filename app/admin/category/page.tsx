"use client";

import ToolBrand from "@/components/admin/Category/ToolBrand/ToolBrand";
import ToolCategory from "@/components/admin/Category/ToolCategory/ToolCategory";
import { PlusIcon } from "@/components/Icons/PlusIcon";
import { useBrand } from "@/hook/brand";
import { useCategory } from "@/hook/category";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, IconButton, Paper, styled } from "@mui/material";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  width: "100%",
  position: "relative",
}));
const Category = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [action, setAction] = useState("");
  const [id, setId] = useState("");
  const { brand, getBrand, deleteBrand, currentBrand, setCurrentBrand } =
    useBrand();
  const {
    category,
    getCategory,
    deleteCategory,
    currentCategory,
    setCurrentCategory,
  } = useCategory();
  const [] = useState({});
  const _addCategory = () => {
    setAction("AddCategory");
    onOpen();
  };
  const _editCategory = (c: ICategory) => {
    setCurrentCategory(c);
    setAction("EditCategory");
    onOpen();
  };
  const _deleteCategory = (c: ICategory) => {
    deleteCategory(c);
  };

  const _addBrand = () => {
    setAction("AddBrand");

    onOpen();
  };
  const _editBrand = (b: IBrand) => {
    setCurrentBrand(b);
    setAction("EditBrand");
    onOpen();
  };
  const _deleteBrand = (b: IBrand) => {
    deleteBrand(b);
  };
  return (
    <>
      <Grid container spacing={2} className="h-full w-full">
        <Grid item xs={6}>
          <Item>
            <h1>Category</h1>
            <Divider />
            <IconButton
              size="small"
              color="primary"
              onClick={_addCategory}
              className="absolute top-0 right-0 p-0"
            >
              <PlusIcon />
            </IconButton>
            {category ? (
              <Listbox>
                {category?.map((c: ICategory) => {
                  return (
                    <ListboxItem key={c._id}>
                      <Card>
                        <CardHeader className="p-1 pl-2">
                          <h4 className="font-bold text-large grow text-left">
                            {c.name}
                          </h4>
                          <div className="float-right">
                            <IconButton className="p-0" size="small">
                              <EditIcon
                                fontSize="small"
                                onClick={() => _editCategory(c)}
                              />
                            </IconButton>
                            <IconButton className="p-0" size="small">
                              <DeleteIcon
                                fontSize="small"
                                onClick={() => _deleteCategory(c)}
                              />
                            </IconButton>
                          </div>
                        </CardHeader>
                        <Divider></Divider>
                        <CardBody className="overflow-visible px-2 flex-row items-start gap-1">
                          {c.brand?.map((item) => {
                            return <Chip key={item._id}>{item.name}</Chip>;
                          })}
                        </CardBody>
                      </Card>
                    </ListboxItem>
                  );
                })}
              </Listbox>
            ) : null}
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <h1>Brand</h1>
            <Divider />
            <IconButton
              size="small"
              color="primary"
              onClick={_addBrand}
              className="absolute top-0 right-0 p-0"
            >
              <PlusIcon />
            </IconButton>
            {brand ? (
              <Listbox>
                {brand?.map((b: IBrand) => {
                  return (
                    <ListboxItem
                      key={b._id}
                      endContent={
                        <>
                          <IconButton className="p-0" size="small">
                            <EditIcon
                              fontSize="small"
                              onClick={() => _editBrand(b)}
                            />
                          </IconButton>
                          <IconButton className="p-0" size="small">
                            <DeleteIcon
                              fontSize="small"
                              onClick={() => _deleteBrand(b)}
                            />
                          </IconButton>
                        </>
                      }
                    >
                      {b.name}
                    </ListboxItem>
                  );
                })}
              </Listbox>
            ) : null}
          </Item>
        </Grid>
      </Grid>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"center"}>
        <ModalContent>
          {(onClose) => (
            <>
              {/* <ModalHeader className="flex flex-col gap-1">
                
              </ModalHeader> */}
              <ModalBody>
                {action == "AddCategory" ? (
                  <ToolCategory closeForm={onClose} type="CREATE" />
                ) : action == "EditCategory" ? (
                  <ToolCategory
                    closeForm={onClose}
                    type="UPDATE"
                    category={currentCategory}
                  />
                ) : action == "AddBrand" ? (
                  <ToolBrand closeForm={onClose} type="CREATE" />
                ) : action == "EditBrand" ? (
                  <ToolBrand
                    closeForm={onClose}
                    type="UPDATE"
                    brand={currentBrand}
                  />
                ) : null}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Category;
