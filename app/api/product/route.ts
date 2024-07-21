import milvusdbConnect, { COLLECTION_NAME } from "@/lib/milvusdbConnect";
import mongodbConnect from "@/lib/mongodbConnect";
import Product from "@/models/Product";
import { DeleteFile, UploadFile } from "@/utils/cloudinary";
import { embeddingText } from "@/utils/huggingFace";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Create product
const handlerAddProduct = async (req: Request, res: Response) => {
  try {
    //   // Extract product data from request body
    await mongodbConnect();
    const milvusClient = await milvusdbConnect();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;
    const model = formData.get("model") as unknown as File;
    const image = formData.get("image") as unknown as File;
    const status = formData.get("status") as string;
    const number = formData.get("number") as string;

    // Extract uploaded image file path
    const [uploadImageResult, uploadModelResult]: [
      uploadImageResult: any,
      uploadModelResult: any
    ] = await Promise.all([
      UploadFile(image, "image"),
      UploadFile(model, "model"),
    ]);

    // Create new product instance
    const product = new Product({
      name,
      price: +price,
      image: {
        image_url: uploadImageResult.secure_url,
        cloudinary_public_id: uploadImageResult.public_id,
      },
      model: {
        model_url: uploadModelResult.secure_url,
        cloudinary_public_id: uploadModelResult.public_id,
      },
      status: status === "true" ? true : status === "false" ? false : status,
      number: +number,
      description,
      category: category,
      brand: brand,
    });
    const vector = await embeddingText(`${name} ${description}`);
    // Save product to database
    const savedProduct = await product.save();
    const insert = await milvusClient.insert({
      collection_name: COLLECTION_NAME,
      data: [
        {
          productId: savedProduct._id.toString(),
          vector,
        },
      ],
    });

    // Send success response
    return NextResponse.json(
      { success: true, data: savedProduct, embedded: insert },
      { status: 201 }
    );
  } catch (error) {
    // Handle error and send error response
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
};

// Read products with pagination
const handlerGetProducts = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();

    const url = new URL(req.url);
    const page =
      url.searchParams.get("page") !== null ||
      url.searchParams.get("page") !== undefined ||
      url.searchParams.get("page") !== ""
        ? (url.searchParams.get("page") as string)
        : "1";
    const limit =
      url.searchParams.get("limit") !== null ||
      url.searchParams.get("limit") !== undefined ||
      url.searchParams.get("limit") !== ""
        ? (url.searchParams.get("limit") as string)
        : "10";

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
    const name = url.searchParams.get("query") ?? "";
    let category = url.searchParams.get("category") ?? "";
    let brand = url.searchParams.get("brand") ?? "";
    const query: any = {};
    if (name) {
      query.name = {
        $regex: ".*" + name + ".*",
        // ,$options: 'i'
      };
    }
    if (brand !== "") {
      //dang sai doan nay
      query.brand = { $in: [new mongoose.Types.ObjectId(brand)] };
    }
    if (category !== "") {
      //dang sai doan nay
      query.category = { $in: [new mongoose.Types.ObjectId(category)] };
    }
    // Calculate skip value based on the page number and limit
    const skip = (options.page - 1) * options.limit;
    // Find products with pagination
    const products = await Product.find(query, null, {
      skip: skip,
      limit: options.limit,
    });
    const count = await Product.find({
      name: {
        $regex: ".*" + name + ".*",
        // ,$options: 'i'
      },
    }).countDocuments();

    // Send success response with product data
    return NextResponse.json(
      { success: true, data: products, count },
      { status: 200 }
    );
  } catch (error) {
    // Handle error and send error response
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
};

// Update product
const handlerUpdateProduct = async (req: Request, res: Response) => {
  try {
    // Connect to MongoDB
    await mongodbConnect();
    const milvusClient = await milvusdbConnect();

    // Extract product data from request body
    const formData = await req.formData();
    const _id = formData.get("_id") as string; // Assuming productId is sent in the request
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;
    const model = formData.get("model") as unknown as File;
    const image = formData.get("image") as unknown as File;
    const status = formData.get("status") as string;
    const number = formData.get("number") as string;

    // Check if product with given productId exists
    const existingProduct = await Product.findById(_id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Update product fields
    existingProduct.name = name;
    existingProduct.price = +price;
    existingProduct.description = description;
    existingProduct.category = category;
    existingProduct.brand = brand;
    existingProduct.status =
      status === "true" ? true : status === "false" ? false : status;
    existingProduct.number = +number;

    // If image or model files are provided, upload and update them
    if (image) {
      const deleteImageResult: any = await DeleteFile(
        existingProduct.image.cloudinary_public_id
      );
      const uploadImageResult: any = await UploadFile(image, "image");
      existingProduct.image = {
        image_url: uploadImageResult.secure_url,
        cloudinary_public_id: uploadImageResult.public_id,
      };
    }

    if (model) {
      const deleteModelResult: any = await DeleteFile(
        existingProduct.model.cloudinary_public_id
      );
      const uploadModelResult: any = await UploadFile(model, "model");
      existingProduct.model = {
        model_url: uploadModelResult.secure_url,
        cloudinary_public_id: uploadModelResult.public_id,
      };
    }

    // Save updated product to database
    const vector = await embeddingText(`${name} ${description}`);
    // Save product to database
    const updatedProduct = await existingProduct.save();
    //find update vector
    const entires: any = await milvusClient.query({
      collection_name: COLLECTION_NAME,
      filter: `productId == "${updatedProduct._id.toString()}"`,
      output_fields: ["id", "vector", "productId"],
      limit: 1,
    });
    //id tra ve la string => parse ra so
    const deleteRes = await milvusClient.delete({
      collection_name: COLLECTION_NAME,
      ids: [entires.data[0].id],
    });
    const updated = await milvusClient.insert({
      collection_name: COLLECTION_NAME,
      data: [
        {
          vector,
          productId: updatedProduct._id.toString(),
        },
      ],
    });
    return NextResponse.json(
      { success: true, data: updatedProduct, embedded: updated },
      { status: 200 }
    );
  } catch (error) {
    // Handle error and send error response
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
};

// Delete product
const handlerDeleteProduct = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();
    const milvusClient = await milvusdbConnect();

    // Extract product ID from request body
    const { _id } = await req.json();

    // Find product by ID and delete it
    const deleteProduct = await Product.findByIdAndDelete(_id);
    const entires: any = await milvusClient.query({
      collection_name: COLLECTION_NAME,
      filter: `productId == "${deleteProduct._id.toString()}"`,
      output_fields: ["id", "vector", "productId"],
      limit: 1,
    });
    if (deleteProduct.image.cloudinary_public_id) {
      const deleteImageResult: any = await DeleteFile(
        deleteProduct.image.cloudinary_public_id
      );
    }

    if (deleteProduct.model.cloudinary_public_id) {
      const deleteModelResult: any = await DeleteFile(
        deleteProduct.model.cloudinary_public_id
      );
    }
    //id tra ve la string => parse ra so
    const deleteRes = await milvusClient.delete({
      collection_name: COLLECTION_NAME,
      ids: [entires.data[0].id],
    });
    // Send success response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Handle error and send error response
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
};
export {
  handlerDeleteProduct as DELETE,
  handlerGetProducts as GET,
  handlerAddProduct as POST,
  handlerUpdateProduct as PUT,
};
// Export upload middleware for images
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
