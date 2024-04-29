import mongodbConnect from "@/lib/mongodbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
type Params = {
  _id: string;
};

const handlerGetSimilarProductById = async (
  req: Request,
  context: { params: Params }
) => {
  try {
    // Connect to MongoDB
    await mongodbConnect();
    // Extract product ID from request params
    const productId = context.params._id;

    // Find product by ID in the database
    const product = await Product.findById(productId);

    // If product with given ID is not found, return error response
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Send success response with product data
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    //Handle error and send error response
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
};
export { handlerGetSimilarProductById as GET };