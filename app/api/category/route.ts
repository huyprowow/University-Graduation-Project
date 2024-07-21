import mongodbConnect from "@/lib/mongodbConnect";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

const handlerAddCategory = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();

    const { name, brand }: { name: string; brand: string[] } = await req.json();

    // Create a new category instance
    const newCategory = new Category({ name, brand });

    // Save the new category to the database
    const savedCategory = await newCategory.save();
    return NextResponse.json(
      { success: true, data: savedCategory },
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
const handlerGetCategory = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();
    const category = await Category.find().populate("brand");
    return NextResponse.json(
      { success: true, data: category },
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
const handlerUpdateCategory = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();

    const { _id, name, brand } = await req.json();
    console.log({ _id, name, brand });
    //Find the category by ID and update its fields
    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      { name, brand },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { success: true, data: "updatedCategory" },
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

const handlerDeleteCategory = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();

    const { _id }: { _id: string } = await req.json();

    const deletedCategory = await Category.findByIdAndDelete(_id);

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { success: true, message: "Category deleted successfully" },
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
  handlerDeleteCategory as DELETE,
  handlerGetCategory as GET,
  handlerAddCategory as POST,
  handlerUpdateCategory as PUT
};

