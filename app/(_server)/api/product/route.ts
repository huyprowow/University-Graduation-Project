import mongodbConnect from "@/lib/mongodbConnect";
import Product from "@/models/Product";
import { UploadFile } from "@/utils/cloudinary";
import { NextResponse } from "next/server";

// Create product
const handlerAddProduct = async (req: Request, res: Response) => {
  try {
    // Extract product data from request body
    await mongodbConnect();

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

    // Save product to database
    const savedProduct = await product.save();

    // Send success response
    return NextResponse.json(
      { success: true, data: savedProduct },
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

    // Calculate skip value based on the page number and limit
    const skip = (options.page - 1) * options.limit;

    // Find products with pagination
    const products = await Product.find({}, null, {
      skip: options.page,
      limit: options.limit,
    });

    // Send success response with product data
    return NextResponse.json(
      { success: true, data: products },
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
      const uploadImageResult: any = await UploadFile(image, "image");
      existingProduct.image = {
        image_url: uploadImageResult.secure_url,
        cloudinary_public_id: uploadImageResult.public_id,
      };
    }

    if (model) {
      const uploadModelResult: any = await UploadFile(model, "model");
      existingProduct.model = {
        model_url: uploadModelResult.secure_url,
        cloudinary_public_id: uploadModelResult.public_id,
      };
    }

    // Save updated product to database
    const updatedProduct = await existingProduct.save();

    // Send success response
    return NextResponse.json(
      { success: true, data: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    // Handle error and send error response
    return NextResponse.json(
      { success: false, error: error },
      { status: 500 }
    );
  }
};

// Delete product
const handlerDeleteProduct = async (req: Request, res: Response) => {
  try {
    // Extract product ID from request body
    const { _id } = await req.json();

    // Find product by ID and delete it
    await Product.findByIdAndDelete(_id);

    // Send success response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Handle error and send error response
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
};

// Export CRUD handlers
export {
  handlerDeleteProduct as DELETE,
  handlerGetProducts as GET,
  handlerAddProduct as POST,
  handlerUpdateProduct as PUT,
};

// Export upload middleware for images
export const config = {
  api: {
    bodyParser: false,
  },
};
