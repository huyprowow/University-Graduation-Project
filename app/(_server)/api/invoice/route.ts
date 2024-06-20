import mongodbConnect from "@/lib/mongodbConnect";
import Invoice from "@/models/Invoice";
import { NextResponse } from "next/server";

const handlerAddInvoice = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();
    const { email, quantity, address, date, paid, product }: any =
      await req.json();

    const newInvoice = new Invoice({
      email,
      quantity,
      address,
      paid,
      product,
    });
    const savedInvoice = await newInvoice.save();

    return NextResponse.json(
      { success: true, data: savedInvoice },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error },
      {
        status: 500,
      }
    );
  }
};

const handlerGetInvoices = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();
    const Invoices = await Invoice.find().populate("product");

    return NextResponse.json(
      { success: true, data: Invoices },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error },
      {
        status: 500,
      }
    );
  }
};

const handlerUpdateInvoice = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();

    const {
      _id,
      email,
      quantity,
      address,
      paid,
      product,
    }: {
      _id: string;
      email: string;
      quantity: number;
      address: string;
      paid: boolean;
      product: string;
    } = await req.json();

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      _id,
      { email, quantity, address, paid },
      { new: true }
    );

    if (!updatedInvoice) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedInvoice },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error },
      {
        status: 500,
      }
    );
  }
};

const handlerDeleteInvoice = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();

    const { _id }: { _id: string } = await req.json();

    const deletedInvoice = await Invoice.findByIdAndDelete(_id);

    if (!deletedInvoice) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { success: true, data: deletedInvoice },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error },
      {
        status: 500,
      }
    );
  }
};

export {
  handlerDeleteInvoice as DELETE,
  handlerGetInvoices as GET,
  handlerAddInvoice as POST,
  handlerUpdateInvoice as PUT,
};
