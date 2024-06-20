import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const ProductItem = ({ product }: { product: IProduct }) => {
  const router = useRouter();
  const handleDetailProduct = (id: string) => {
    router.push(`/product/${id}`);
  };
  return (
    <Card
      className="col-span-12 sm:col-span-3 h-[300px]"
      shadow="sm"
      key={product._id}
      isPressable
      onPress={() => handleDetailProduct(product._id)}
    >
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={product.name}
          className="w-full object-cover h-[140px]"
          src={product.image.image_url}
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <b>{product.name}</b>
        <p className="text-default-500">{product.price}$</p>
      </CardFooter>
    </Card>
  );
};

export default ProductItem;
