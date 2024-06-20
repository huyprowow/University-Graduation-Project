interface IProduct {
  _id: string;
  name: string;
  price: number;
  image: {
    image_url: string;
    cloudinary_public_id: string;
  };
  status: boolean;
  number: number;
  description: string;
  model: {
    model_url: string;
    cloudinary_public_id: string;
  };
  category: ICategory[];
  brand: IBrand[];
}
