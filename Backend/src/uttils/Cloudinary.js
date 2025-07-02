import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localPath) => {
    try {
        if (!localPath) return null;

        // upload file to cloudinary 
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto"
          });
        // remove temp file after successful upload
        await fs.promises.unlink(localPath);

        return response;
    } catch (error) {
        console.error("Upload failed: ", error.messsage);
        if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath); // remove temp file if exists
        }
        return null;
    }
}

export { uploadOnCloudinary }
