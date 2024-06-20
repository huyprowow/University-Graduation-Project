import { useInvoice } from "@/hook/invoice";
import { usePayment } from "@/hook/payment";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PaymentIcon from "@mui/icons-material/Payment";
import { Alert, Snackbar } from "@mui/material";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);
const Order = ({
  currentProduct,
  loading,
}: {
  currentProduct: IProduct;
  loading: any;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState("");
  const { checkoutProduct } = usePayment();
  const { createNewInvoice } = useInvoice();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleChange = (prop) => (event) => {
    const { value, checked, files } = event.target;
    switch (prop) {
      case "email":
        setEmail(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "quantity":
        setQuantity(value);
        break;
      default:
        break;
    }
  };
  const handleCheckoutProduct = async (
    invoice: any,
    currentProduct: IProduct
  ) => {
    const stripeSession: any = await checkoutProduct(currentProduct);
    if (stripeSession) {
      const res = router.push(stripeSession.url);
    }
  };
  const handleOrder = async (event, type) => {
    event.preventDefault();
    if (
      email === "" ||
      quantity === "" ||
      address === "" ||
      !email?.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      setOpen(true);
      return;
    } else {
      if (type == "orderAndPay") {
        const res = await createNewInvoice(
          {
            email: email,
            quantity: +quantity,
            address: address,
            paid: false,
            product: currentProduct,
          } as Omit<IInvoice, "_id">,
          handleCheckoutProduct,
          currentProduct
        );
        console.log(res);
      } else {
        const res = await createNewInvoice(
          {
            email: email,
            quantity: +quantity,
            address: address,
            paid: false,
            product: currentProduct,
          } as Omit<IInvoice, "_id">,
          null,
          currentProduct
        );
        console.log(res);
      }

      onClose();
    }
  };
  return (
    <>
      <Button
        isDisabled={loading}
        fullWidth
        className="bg-pink-600 leading-16 mt-1"
        onClick={onOpen}
      >
        <LocalMallIcon /> Order now
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Order Product</ModalHeader>
              <ModalBody>
                <form>
                  <div>
                    <Input
                      required
                      isRequired
                      data-required
                      value={email}
                      onChange={handleChange("email")}
                      type="email"
                      label="Email"
                      placeholder="you@example.com"
                      labelPlacement="outside"
                      startContent={
                        <svg
                          aria-hidden="true"
                          fill="none"
                          focusable="false"
                          height="1em"
                          role="presentation"
                          viewBox="0 0 24 24"
                          width="1em"
                          className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
                        >
                          <path
                            d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM17.47 9.59L14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91L16.53 8.41C16.85 8.15 17.33 8.2 17.58 8.53C17.84 8.85 17.79 9.33 17.47 9.59Z"
                            fill="currentColor"
                          />
                        </svg>
                      }
                    />
                    <Input
                      value={quantity}
                      data-required
                      onChange={handleChange("quantity")}
                      isRequired
                      required
                      type="number"
                      label="Quantity"
                      placeholder="0"
                      labelPlacement="outside"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                    />
                    <Input
                      isRequired
                      value={address}
                      data-required
                      required
                      onChange={handleChange("address")}
                      type="text"
                      label="Address"
                      placeholder="Address order"
                      labelPlacement="outside"
                    />
                  </div>

                  <Button
                    isDisabled={loading}
                    fullWidth
                    className="bg-pink-600 leading-16 mt-1"
                    onClick={(e) => handleOrder(e, "orderAndPay")}
                    type="submit"
                  >
                    <PaymentIcon />
                    Order and Checkout
                    <ArrowOutwardIcon />
                  </Button>
                  <Button
                    isDisabled={loading}
                    fullWidth
                    className="bg-pink-600 leading-16 mt-1"
                    onClick={(e) => handleOrder(e, "order")}
                    type="submit"
                  >
                    <LocalMallIcon /> Order
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert variant="filled" severity="warning">
          Enter your mail, address and quantity or email not correct format
        </Alert>
      </Snackbar>
    </>
  );
};

export default Order;
