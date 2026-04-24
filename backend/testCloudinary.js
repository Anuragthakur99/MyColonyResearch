import cloudinary from "./utils/cloudinary.js";
import fs from "fs";
import path from "path";

// Create a tiny valid PNG (1x1 pixel) as base64 data URI
const base64PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

cloudinary.uploader.upload(base64PNG, { folder: "test" })
  .then(res => {
    console.log("✅ Cloudinary working! URL:", res.secure_url);
    cloudinary.uploader.destroy(res.public_id).then(() => console.log("🧹 Test image deleted"));
  })
  .catch(err => console.error("❌ Cloudinary failed:", err.message));
