import { CURRENCY } from "@/utils/constant";
import { formatAmountForStripe } from "@/utils/utils";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function handlerCheckout(req: Request, res: Response) {
  try {
    const {
      _id,
      name,
      price,
      description,
      category,
      brand,
      model,
      image,
      status,
      number,
    }: IProduct = await req.json();
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: name,
              images: image ? [image.image_url] : null,
            },
            unit_amount: formatAmountForStripe(price, CURRENCY),
          },
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
    });
    return NextResponse.json(session, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err },
      {
        status: err.statusCode || 500,
      }
    );
  }
}
export { handlerCheckout as POST };
