"use client";
import Order from "@/components/product/Order/Order";
import { useBrand } from "@/hook/brand";
import { useProduct } from "@/hook/product";
import { mobileAndTabletCheck } from "@/utils/utils";
import ImageIcon from "@mui/icons-material/Image";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import { Divider, Grid, Typography } from "@mui/material";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./style.scss";
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const ProductDetail = ({ params }: { params: { id: string } }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const isMb = mobileAndTabletCheck();
    setIsMobile(isMb);
  }, []);
  const router = useRouter();
  const [imageView, setImageView] = useState(true);
  const { brand, getBrand } = useBrand();
  const {
    getSimilarProductById,
    getProductById,
    loading,
    currentProduct,
    similarProduct,
  } = useProduct();
  useEffect(() => {
    getProductById(params.id);
    getSimilarProductById(params.id);
    getBrand();
  }, []);
  const handleDetailProduct = (id: string) => {
    router.push(`/product/${id}`);
  };

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);
  return (
    <div id="product_detail">
      <Grid container spacing={3} className="p-3" id="product-image_model">
        <Grid item xs={7} sm={8}>
          {imageView ? (
            <div
              style={{
                position: "relative",
              }}
            >
              <Image
                style={{
                  width: "100%",
                  minHeight: 400,
                }}
                loading={loading}
                alt="Image"
                src={currentProduct?.image.image_url}
              />
              <Button isIconOnly className="absolute top-0 right-0 z-10">
                <ThreeDRotationIcon onClick={() => setImageView(false)} />
              </Button>
            </div>
          ) : (
            <div
              style={{
                position: "relative",
              }}
            >
              <model-viewer
                alt={"model product"}
                // src="uploads/2015_mercedes-amg_gt3.glb"
                src={currentProduct?.model.model_url}
                ar
                // environment-image="shared-assets/environments/moon_1k.hdr"
                // poster="shared-assets/models/NeilArmstrong.webp"
                shadow-intensity="1"
                camera-controls
                touch-action="pan-y"
              ></model-viewer>
              <Button isIconOnly className="absolute top-0 right-0 z-10">
                <ImageIcon onClick={() => setImageView(true)} />
              </Button>
            </div>
          )}
        </Grid>
        <Grid item xs={5} sm={4}>
          <div class="min-w-[400]">
            <Typography variant="h4" className="capitalize">
              {currentProduct?.name}
            </Typography>
            <Divider></Divider>
            <Typography
              variant="h5"
              gutterBottom
              className="text-green-500 leading-16 pt-2"
            >
              $ {currentProduct?.price}
            </Typography>
            <Typography variant="body1" gutterBottom className="leading-16">
              <b>Brand:</b>
              {currentProduct?.brand
                ? brand.find((b) => {
                    return (
                      b._id === ((currentProduct?.brand as any)[0] as string)
                    );
                  })?.name
                : "No Brand"}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              className={`leading-16 ${
                currentProduct?.status
                  ? " border-green-100 text-green-500"
                  : " border-red-100 text-red-500"
              }`}
            >
              {currentProduct?.status ? "on sale" : "out of stock"}
            </Typography>
            <Divider></Divider>
            <Typography
              variant="body1"
              gutterBottom
              className="leading-16 pt-2"
            >
              <b>
                Description: <br />
              </b>
              {currentProduct?.description}
            </Typography>
            <Divider></Divider>
          </div>
          <Order currentProduct={currentProduct} loading={loading} />
        </Grid>
      </Grid>
      <Typography
        variant="h5"
        className="p-4 text-slate-400  underline decoration-pink-600 decoration-1 underline-offset-7 hover:decoration-pink-400 hover:decoration-4"
      >
        Similar product
      </Typography>
      {similarProduct ? (
        <Carousel
          swipeable={true}
          draggable={false}
          showDots={true}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={1000}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          deviceType={isMobile ? "mobile" : "desktop"}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {similarProduct?.map((product, index) => (
            <Card
              // className="max-w-[300] max-h-[400] m-3"
              shadow="sm"
              key={product._id}
              isPressable
              onPress={() => handleDetailProduct(product._id)}
            >
              <CardBody className="overflow-visible px-0">
                <Image
                  style={{
                    width: 200,
                    height: 200,
                  }}
                  alt={product.name}
                  src={product.image.image_url}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{product.name}</b>
                <p className="text-default-500">{product.price}$</p>
              </CardFooter>
            </Card>
          ))}
        </Carousel>
      ) : null}
    </div>
  );
};

export default ProductDetail;
