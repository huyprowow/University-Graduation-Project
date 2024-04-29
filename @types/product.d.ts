interface IProduct {
  _id: string;
  name: string;
  price: Number;
  image: {
    image_url: String;
    cloudinary_public_id: String;
  };
  status: Boolean;
  number: Number;
  description: String;
  model: {
    model_url: String;
    cloudinary_public_id: String;
  };
  category: ICategory[];
  brand: IBrand[];
}
