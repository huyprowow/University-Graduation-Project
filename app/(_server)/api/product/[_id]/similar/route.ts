import milvusdbConnect, { COLLECTION_NAME } from "@/lib/milvusdbConnect";
import mongodbConnect from "@/lib/mongodbConnect";
import Product from "@/models/Product";
import mongoose from "mongoose";
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
    const milvusClient = await milvusdbConnect();

    // Extract product ID from request params
    const productId_search = context.params._id;
    const entires: any = await milvusClient.query({
      collection_name: COLLECTION_NAME,
      filter: `productId == "${productId_search}"`,
      output_fields: ["id", "vector", "productId"],
      limit: 1,
    });
    // Find product by ID in the database
    if (entires.data.length <= 0) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    const searchVector = entires.data[0].vector;

    const res = await milvusClient.search({
      // required
      collection_name: COLLECTION_NAME, // required, the collection name
      data: searchVector, // required, vector used to compare other vectors in milvus
      // // optionals
      // filter: 'height > 0', // optional, filter expression
      // params: { nprobe: 64 }, // optional, specify the search parameters
      limit: 6, // optional, specify the number of nearest neighbors to return
      output_fields: ["*"], // optional, specify the fields to return in the search results,
    });
    if (res.results.length <= 0) {
      return NextResponse.json(
        { success: false, error: "Not have product similar" },
        { status: 404 }
      );
    }
    // {score: number,
    // id: string,
    // vector: any,
    // productId: string}
    const productIdSimilars = Array.from(res.results)
      ?.map((item) => item.productId)
      ?.filter((productId) => productId != productId_search);
    if (productIdSimilars.length <= 0) {
      return NextResponse.json(
        { success: false, error: "Not have product similar" },
        { status: 404 }
      );
    }
    const searchIds = productIdSimilars?.map(
      (i) => new mongoose.Types.ObjectId(i)
    );
    const products = await Product.find(
      {
        _id: { $in: productIdSimilars },
      },
      {},
      {
        strictPopulate: false,
      }
    );

    // If product with given ID is not found, return error response

    // Send success response with product data
    return NextResponse.json(
      { success: true, data: products },
      { status: 200 }
    );
  } catch (error) {
    //Handle error and send error response
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
};
export { handlerGetSimilarProductById as GET };
