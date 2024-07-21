"use client";
import { ChevronDownIcon } from "@/components/Icons/ChevronDownIcon";
import { PlusIcon } from "@/components/Icons/PlusIcon";
import { SearchIcon } from "@/components/Icons/SearchIcon";
import { VerticalDotsIcon } from "@/components/Icons/VerticalDotsicon";
import { useBrand } from "@/hook/brand";
import { useCategory } from "@/hook/category";
import { useProduct } from "@/hook/product";
import { capitalize } from "@/utils/utils";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ToolProduct from "../ToolProduct/ToolProduct";
const columns = [
  { name: "ID", uid: "_id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "IMAGE", uid: "image", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "QUANTITY", uid: "number", sortable: true },
  { name: "DESCRIPTION", uid: "description" },
  { name: "CATEGORY", uid: "category" },
  { name: "BRAND", uid: "brand" },
  { name: "MODEL", uid: "model" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "all", uid: "all" },
  { name: "stocking", uid: "stocking" },
  { name: "out of stock", uid: "out of stock" },
];

const statusColorMap = {
  stocking: "success",
  "out of stock": "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "_id",
  "name",
  "image",
  "status",
  "number",
  "description",
  "category",
  "brand",
  "model",
  "actions",
];

const ProductTable = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [action, setAction] = useState("");
  const [currentProduct, setCurrentProduct] = useState<IProduct>(
    {} as IProduct
  );
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });

  const {
    product,
    getProduct,
    countProduct,
    loading,
    deleteProduct,
    search,
    setSearch,
  } = useProduct();
  const { page, limit, query } = search;
  const { brand, getBrand } = useBrand();
  const { category, getCategory } = useCategory();
  const hasSearchFilter = Boolean(query);

  const headerColumns = React.useMemo(() => {

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);
  useEffect(() => {
    getProduct();
  }, [page, limit, query]);
  const pages = React.useMemo(
    () => Math.ceil(countProduct / limit),
    [page, countProduct, limit]
  );

  const _addProduct = () => {
    setAction("AddProduct");
    onOpen();
  };
  const _editProduct = (p: IProduct) => {
    setCurrentProduct(p);
    setAction("EditProduct");
    onOpen();
  };

  const renderCell = React.useCallback(
    (product: IProduct, columnKey: any) => {
      const cellValue: any = product[columnKey as keyof IProduct] as any;

      switch (columnKey) {
        case "status":
          return (
            <Chip
              className="capitalize"
              color={
                statusColorMap[product.status ? "stocking" : "out of stock"] as any
              }
              size="sm"
              variant="flat"
            >
              {cellValue ? "stocking" : "out of stock"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onClick={() => _editProduct(product)}>
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    className="text-red-500"
                    onClick={() => handleDeleteProduct(product)}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "image":
          return (
            <Image
              width={100}
              height={100}
              alt="Image"
              src={cellValue.image_url}
            />
          );
        case "model":
          return cellValue.model_url ? (
            <model-viewer
              alt={"model product"}
              // src="uploads/2015_mercedes-amg_gt3.glb"
              src={cellValue.model_url}
              ar
              // environment-image="shared-assets/environments/moon_1k.hdr"
              // poster="shared-assets/models/NeilArmstrong.webp"
              shadow-intensity="1"
              camera-controls
              touch-action="pan-y"
            ></model-viewer>
          ) : null;
        case "category":
          return (
            <>
              {category?.map((i) => {
                return i._id === cellValue[0] ? i.name : null;
              })}
            </>
          );
        case "brand":
          return (
            <>
              {brand?.map((i) => {
                return i._id === cellValue[0] ? i.name : null;
              })}
            </>
          );
        case "description":
          return (
            <div className="h-[200px] min-w-[300px] flex align-middle items-center">
              {cellValue}
            </div>
          );

        default:
          return cellValue;
      }
    },
    [brand, category]
  );
  const handleDeleteProduct = (product:any) => {
    deleteProduct(product);
  };
  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setSearch({
        ...search,
        page: page + 1,
      });
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setSearch({
        ...search,
        page: page - 1,
      });
    }
  }, [page]);

  const onLimitChange = React.useCallback((e) => {
    setSearch({
      ...search,
      page: 1,
      limit: Number(e.target.value),
    });
  }, []);

  // React.useCallback(
  const onSearchChange = (value) => {
    // const { page, limit, query } = search;
    if (value) {
      setSearch({
        ...search,
        query: value,
        page: 1,
      });
    } else {
      setSearch({
        ...search,
        query: "",
        page: 1,
      });
    }
  };
  //   [page, limit, query]
  // );
  const onChangePage = (newPage: number) => {
    setSearch({
      ...search,
      page: newPage,
    });
  };

  const onClear = React.useCallback(() => {
    setSearch({
      ...search,
      query: "",
      page: 1,
    });
  }, [page, limit, query]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={query}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions?.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns?.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onClick={_addProduct}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {countProduct} product
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onLimitChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    query,
    statusFilter,
    visibleColumns,
    onLimitChange,
    countProduct,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-around items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={onChangePage}
        />
      </div>
    );
  }, [product?.length, page, pages, hasSearchFilter]);

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={
          {
            // wrapper: "max-h-[382px]",
          }
        }
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No product found"}
          items={product}
          isLoading={loading}
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="full"
        scrollBehavior={"normal"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* <ModalHeader className="flex flex-col gap-1">
                
              </ModalHeader> */}
              <ModalBody style={{overflow:"auto"}}>
                {action == "AddProduct" ? (
                  <ToolProduct closeForm={onClose} type="CREATE" />
                ) : action == "EditProduct" ? (
                  <ToolProduct
                    closeForm={onClose}
                    type="UPDATE"
                    product={currentProduct}
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
export default ProductTable;
