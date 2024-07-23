import { EmailTemplate } from "@/components/email-template";
import mongodbConnect from "@/lib/mongodbConnect";
import Invoice from "@/models/Invoice";
import Shipment from "@/models/Shipment";
import axios from "axios";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const GEOCODE_API_URL = `https://nominatim.openstreetmap.org/search?format=json&q=`;

const handlerAddInvoice = async (req: Request, res: Response) => {
  try {
  await mongodbConnect();
  const { email, quantity, address, date, paid, product }: any =
    await req.json();
  // Create a new shipment with the destination geolocation
  // Geocode the address to get the coordinates
  const response = await axios.get(
    GEOCODE_API_URL + encodeURIComponent(address)
  );
  if (response.data.length > 0) {
    const { lat, lon } = response.data[0];
    console.log(response.data);
    const shipment = await Shipment.create({
      email,
      address,
      destinationLocation: {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)],
      },
      product,
      status: "Pending",
    });
    const newInvoice = new Invoice({
      email,
      quantity,
      address,
      geolocation: {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)],
      },
      paid,
      product,
      shipment: shipment._id,
    });
    const savedInvoice = await newInvoice.save();
    const { data, error } = await resend.emails.send({
      from: "IAStore <onboarding@resend.dev>",
      to: [email],
      subject: "Thank for ordering",
      react: EmailTemplate({
        message: `Thank you for ordering ${quantity} product ${product.name}`,
      }),
    });

    return NextResponse.json(
      { success: true, data: savedInvoice },
      {
        status: 201,
      }
    );
  } else {
    return NextResponse.json({
      success: false,
      message: "Geocoding failed: No results found",
    });
  }
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
    const Invoices = await Invoice.find()
      .populate("product")
      .populate("shipment")
      .sort({ date: -1 });

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
      mode,
    }: {
      _id: string;
      email: string;
      quantity: number;
      address: string;
      paid: boolean;
      product: string;
      mode: "pay" | "update";
    } = await req.json();

    if (paid === true) {
      console.log("pay");
      if (mode === "pay") {
        const { data, error } = await resend.emails.send({
          from: "IAStore <onboarding@resend.dev>",
          to: [email],
          subject: "Payment success",
          react: EmailTemplate({
            message: `Payment success for invoice ${_id}`,
          }),
        });
      }
    }

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
