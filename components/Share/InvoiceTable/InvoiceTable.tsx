"use client";
import { EShipmentStatus } from "@/constant/enum";
import { useInvoice } from "@/hook/invoice";
import { usePayment } from "@/hook/payment";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import PaymentIcon from "@mui/icons-material/Payment";
import { Stack } from "@mui/material";

import {
  Button,
  Chip,
  getKeyValue,
  Link,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
const InvoiceTable = ({ mode }: { mode: "admin" | "user" }) => {
  const { loading, invoice, getInvoice, updateInvoice } = useInvoice();
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;
  const { data: session } = useSession();
  const { checkoutProduct } = usePayment();
  const router = useRouter();
  useEffect(() => {
    getInvoice();
  }, []);
  const invoiceFilter =
    session?.user?.role === "admin"
      ? invoice
      : invoice?.filter((item) => item.email === session?.user?.email);
  const pages = Math.ceil(invoiceFilter.length / rowsPerPage);
  console.log(invoiceFilter);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return invoiceFilter.slice(start, end);
  }, [page, invoiceFilter]);
  const handleCheckoutProduct = async (
    invoice: any,
    currentProduct: IProduct
  ) => {
    localStorage.setItem(
      "invoice_Encode",
      invoice._id ? btoa(JSON.stringify(invoice)) : ""
    );
    const stripeSession: any = await checkoutProduct(currentProduct);
    if (stripeSession) {
      const res = router.push(stripeSession.url);
    }
  };
  const handleUpdateInvoice = (invoice: IInvoice) => {
    const res = updateInvoice({
      _id: invoice._id,
      address: invoice.address,
      quantity: invoice.quantity,
      email: invoice.email,
      product: invoice.product,
      paid: !invoice.paid,
      mode: "update",
    });
  };

  const openLink = async (link: string) => {
    window.open(link, "_blank");
  };

  const renderValue = (item, columnKey) => {
    if (columnKey === "paid") {
      return (
        <Chip
          className="capitalize"
          color={item["paid"] === true ? "success" : "warning"}
          size="sm"
          variant="flat"
        >
          {item["paid"] === true ? "paid" : "ordering"}
        </Chip>
      );
    } else if (columnKey === "product.name") {
      return <>{item.product.name}</>;
    } else if (columnKey === "shipment.status") {
      return <>{item?.shipment?.status}</>;
    } else if (columnKey === "action") {
      if (mode == "admin") {
        return (
          <>
            <Link
              className="w-full"
              href={`/shipper/${item.shipment._id}`}
              size="lg"
            >
              shipping
            </Link>
            <Popover placement="bottom" showArrow={true}>
              <PopoverTrigger>
                {item.paid ? <CreditCardOffIcon /> : <CreditScoreIcon />}
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-small font-bold">
                    {" "}
                    is this {item.paid ? "not" : ""} paid?
                  </div>
                  <div className="text-tiny">
                    <Button onClick={() => handleUpdateInvoice(item)}>
                      paid
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        );
      } else {
        return item["paid"] === true ? (
          <></>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              isDisabled={loading}
              fullWidth
              className="bg-pink-600 leading-16 mt-1"
              onClick={() => handleCheckoutProduct(item, item.product)}
              type="submit"
            >
              <PaymentIcon />
              Checkout
              <ArrowOutwardIcon />
            </Button>
            {session?.user?.role === "admin" ? (
              <>
                <Button
                  fullWidth
                  className="text-center bg-orange-600 leading-16 mt-1"
                  onClick={() => openLink(`/shipper/${item?.shipment?._id}`)}
                >
                  Shipping
                  <ArrowOutwardIcon />
                </Button>
              </>
            ) : null}
            {item?.shipment?.status === EShipmentStatus.Shipping ? (
              <Button
                fullWidth
                className="text-center bg-orange-600 leading-16 mt-1"
                onClick={() => openLink(`/tracking/${item?.shipment?._id}`)}
              >
                Tracking Ship
                <ArrowOutwardIcon />
              </Button>
            ) : null}
          </Stack>
        );
      }
    } else {
      return getKeyValue(item, columnKey);
    }
  };
  return (
    <Table
      aria-label="Example table with client side pagination"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader>
        <TableColumn key="_id">_id</TableColumn>
        <TableColumn key="email">email</TableColumn>
        <TableColumn key="quantity">quantity</TableColumn>
        <TableColumn key="address">address</TableColumn>
        <TableColumn key="paid">paid</TableColumn>
        <TableColumn key="product.name">product name</TableColumn>
        <TableColumn key="shipment.status">shipment status</TableColumn>
        <TableColumn key="action">action</TableColumn>
      </TableHeader>
      <TableBody
        items={items}
        isLoading={loading}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default InvoiceTable;
