import { Client, ID, Storage } from "appwrite";

const client = new Client();
const storage = new Storage(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("your_porjectId"); // Replace with your project ID

export const UploadFile = async (fileUri) => {
  if (!fileUri) {
    throw new Error("File URI is required");
  }

  try {
    // Fetch file and convert to Blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    // Create a File object from Blob
    const fileName = fileUri.split("/").at(-1); // Extract file name from URI
    const file = new File([blob], fileName, { type: blob.type });

    console.log(file);
    // Upload file to Appwrite
    const result = await storage.createFile(
      "677002d9002655d49493", // Replace with your bucket ID
      ID.unique(),
      file
    );
    const url = await storage.getFilePreview(
      "your porject bucketID",
      result.$id
    );
    return url;
  } catch (error) {
    console.error("Upload failed:", error.message);
    throw error;
  }
};
