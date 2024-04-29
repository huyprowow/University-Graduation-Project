import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRECT,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

// upload 

export const UploadFile = async (file: File, folder: string) => {
  const arrayBuffer = await file.arrayBuffer();
  const bytesBuffer = Buffer.from(arrayBuffer);

  return new Promise(async (resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folder,
        },
        async (err, result) => {
          if (err) {
            reject(err.message);
          }
          resolve(result);
        }
      )
      .end(bytesBuffer);
  });
};

// delete

export const DeleteFile = async (public_id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await cloudinary.uploader.destroy(public_id);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
