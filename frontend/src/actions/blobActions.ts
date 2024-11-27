"use server";
import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import { FileReference } from "@/types";
import {
  BlobSASPermissions,
  BlobSASSignatureValues,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

export async function uploadFiles(files: File[]) {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("Azure Storage connection string is not defined.");
  }

  const blobServiceClient: BlobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);

  const containerClient = blobServiceClient.getContainerClient("files");

  try {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const uploaded = new Date();
        const session =
          !process.env.NEXT_PUBLIC_NO_AUTH &&
          (await getCustomServerSession(authOptions));
        const user =
          session && session?.user?.name ? session.user.name : "Unknown";
        const blobName = `${file.name}${uploaded}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadData(buffer, {
          blobHTTPHeaders: { blobContentType: file.type },
        });

        return {
          fileName: file.name,
          blobName: blobName,
          uploadedOn: uploaded,
          uploadedBy: user,
        } as FileReference;
      }),
    );

    return uploadedFiles;
  } catch (error) {
    console.error("Error uploading files to Azure Blob Storage:", error);
    throw new Error("Failed to upload files.");
  }
}

export async function deleteFiles(blobNames: string[]) {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("Azure Storage connection string is not defined.");
  }
  const blobServiceClient: BlobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);

  const containerClient = blobServiceClient.getContainerClient("files");

  try {
    await Promise.all(
      blobNames.map(async (blobName) => {
        const blobClient = containerClient.getBlobClient(blobName);
        await blobClient.delete();
      }),
    );
  } catch (error) {
    console.error("Error deleting files from Azure Blob Storage:", error);
    throw new Error("Failed to delete files.");
  }
}

export async function getDownloadUrl(blobName: string, fileName: string) {
  // Optionally, implement authentication and authorization checks here

  try {
    const containerName = "files";

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error("Azure Storage connection string is not defined.");
    }

    const blobServiceClient: BlobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    // Check if the blob exists
    const exists = await blobClient.exists();
    if (!exists) {
      throw new Error("File not found.");
    }

    // Generate SAS token
    const sasOptions: BlobSASSignatureValues = {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"), // Read permission
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 5 * 60 * 1000), // Expires in 5 minutes
      contentDisposition: `attachment; filename="${encodeURIComponent(
        fileName,
      )}"`,
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      blobServiceClient.credential as StorageSharedKeyCredential,
    ).toString();
    const sasUrl = `${blobClient.url}?${sasToken}`;

    return sasUrl;
  } catch (error) {
    console.error("Error generating download URL:", error);
    throw new Error("Error generating download URL.");
  }
}
