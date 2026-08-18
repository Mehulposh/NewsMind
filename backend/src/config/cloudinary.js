import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadImage = async (filePath, folder = 'newsmind') => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return null;
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return result.secure_url;
};
