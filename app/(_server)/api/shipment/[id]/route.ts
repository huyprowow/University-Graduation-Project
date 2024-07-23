import { EShipmentStatus } from "@/constant/enum";
import mongodbConnect from "@/lib/mongodbConnect";
import Shipment from "@/models/Shipment";
import { NextResponse } from "next/server";
type Params = {
  id: string;
};

const handlerGetShipmentById = async (
  req: Request,
  context: { params: Params }
) => {
  await mongodbConnect();

  const id = context.params.id;

  try {
    const shipment = await Shipment.findById(id);
    // console.log(shipment);
    return NextResponse.json(
      { success: true, data: shipment },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false },
      {
        status: 400,
      }
    );
  }
};
const handlerUpdateShipmentById = async (
  req: Request,
  context: { params: Params }
) => {
  await mongodbConnect();

  const id = context.params.id;

  try {
    const { status, currentLocation }: any = await req.json();
    // console.log({status, currentLocation})
    let updateData:any= { status };
    if (currentLocation&&status === EShipmentStatus.Shipping) {
      updateData = {
        status,
        currentLocation,
      };
    }
    const shipment = await Shipment.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return NextResponse.json(
      { success: true, data: shipment },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false },
      {
        status: 400,
      }
    );
  }
};
export { handlerGetShipmentById as GET, handlerUpdateShipmentById as PUT };
