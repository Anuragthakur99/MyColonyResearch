import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const {
  VITE_MYCOLONY_AWS_ACCESS_KEY,
  VITE_MYCOLONY_AWS_SECRET_KEY,
  VITE_MYCOLONY_AWS_REGION,
  VITE_MYCOLONY_AWS_BUCKET_NAME,
} = import.meta.env;

const s3Uploader = new S3Client({
  region: VITE_MYCOLONY_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: VITE_MYCOLONY_AWS_ACCESS_KEY || "",
    secretAccessKey: VITE_MYCOLONY_AWS_SECRET_KEY || "",
  },
});

const UploadToS3Bucket = async ({
  filename,
  fileContent,
  mimetype,
}) => {
  const params = {
    Bucket: VITE_MYCOLONY_AWS_BUCKET_NAME,
    Key: filename,
    Body: fileContent,
    ContentType: mimetype,
  };
  return s3Uploader.send(new PutObjectCommand(params));
};

export { UploadToS3Bucket };