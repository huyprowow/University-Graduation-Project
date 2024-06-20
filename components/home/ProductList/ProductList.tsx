import { useProduct } from "@/hook/product";
import { Pagination } from "@nextui-org/react";
import { useEffect } from "react";
import ProductItem from "./ProductItem";
const ProductList = () => {
  const { product, countProduct, search, setSearch, getProduct } = useProduct();

  const onChangePage = (newPage: number) => {
    setSearch({ ...search, page: newPage });
  };
  const { page, limit, query, category, brand } = search;
  useEffect(() => {
    getProduct();
  }, [page, limit, query, category, brand]);

  return (
    <>
      <div
        className="sm:max-w-[900px] md:max-w-[1200px] sm:gap-2 grid grid-cols-12 grid-rows-2 px-8 "
        style={{ margin: "0 auto" }}
      >
        {product?.map((item, index) => (
          <ProductItem key={item._id} product={item} />
        ))}
      </div>
      <Pagination
        className="max-w-fit"
        style={{ margin: "0 auto" }}
        showControls
        showShadow
        color="primary"
        page={page}
        total={Math.ceil(countProduct / limit)}
        onChange={onChangePage}
      />
    </>
  );
};

export default ProductList;
