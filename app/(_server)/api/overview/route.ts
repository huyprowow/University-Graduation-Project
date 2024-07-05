import mongodbConnect from "@/lib/mongodbConnect";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextResponse } from "next/server";

const handlerGetOverviews = async (req: Request, res: Response) => {
  try {
    await mongodbConnect();
    const totalProduct = await Product.countDocuments();
    const revenue = await Invoice.aggregate([
      {
        $match: {
          paid: true,
        },
      },
      {
        $lookup: {
          from: "Product", // The collection name in MongoDB
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: ["$quantity", "$productDetails.price"],
            },
          },
        },
      },
    ]);
    const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;
    const totalOrdered = await Invoice.countDocuments();
    const totalUser = await User.find({
      isAdmin: false,
    }).countDocuments();
    const dailySales = await Invoice.aggregate([
      {
        $lookup: {
          from: "Product",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          totalSales: {
            $sum: { $multiply: ["$quantity", "$productDetails.price"] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          totalSales: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);


    return NextResponse.json(
      {
        success: true,
        data: {
          totalProduct,
          totalRevenue,
          totalOrdered,
          totalUser,
          dailySales,
        },
      },
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

export { handlerGetOverviews as GET };
