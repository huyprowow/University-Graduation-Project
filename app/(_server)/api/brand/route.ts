import mongodbConnect from "@/lib/mongodbConnect";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";

const handlerAddBrand = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();
    const { name, product }: { name: string; product: string[] | null } =
      await req.json();

    const newBrand = new Brand({ name, product });
    const savedBrand = await newBrand.save();

    return NextResponse.json(
      { success: true, data: savedBrand },
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

const handlerGetBrands = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();
    const brands = await Brand.find();

    return NextResponse.json(
      { success: true, data: brands },
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

const handlerUpdateBrand = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();

    const {
      _id,
      name,
      product,
    }: { _id: string; name: string; product: string[] | null } =
      await req.json();

    const updatedBrand = await Brand.findByIdAndUpdate(
      _id,
      { name, product },
      { new: true }
    );

    if (!updatedBrand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedBrand },
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
const handlerDeleteBrand = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();

    const { _id }: { _id: string } = await req.json();

    const deletedBrand = await Brand.findByIdAndDelete(_id);

    if (!deletedBrand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { success: true, data: deletedBrand },
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
  handlerDeleteBrand as DELETE,
  handlerGetBrands as GET,
  handlerAddBrand as POST,
  handlerUpdateBrand as PUT,
};
