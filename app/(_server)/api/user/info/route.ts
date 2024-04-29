import mongodbConnect from "@/lib/mongodbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

const getInfo = async (req: Request, res: Response) => {
  await mongodbConnect();
  const data: { email: string } = await req.json();
  const userInfo = await User.findOne({ email: data.email });
  return NextResponse.json(userInfo);
};
export { getInfo as POST };
