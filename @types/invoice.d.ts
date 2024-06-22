interface IInvoice {
  _id: string;
  email: string;
  quantity: number;
  address: string;
  date?: Date;
  paid: Boolean;
  product: IProduct;
}
interface IInvoiceRequest extends IInvoice {
  mode: "pay" | "update";
}
