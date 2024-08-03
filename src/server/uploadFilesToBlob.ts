import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { StorageContainerName } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const uploadFilesToBlob = async (files: File[], location: StorageContainerName): Promise<string[]> => {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  let containerName;

  if (location === StorageContainerName.Locations) {
    containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
  }

  if (!connectionString || !containerName || !accountName || !accountKey) {
    throw new Error(
      'Azure Storage connection string, container name, account name, or account key is not set in environment variables',
    );
  }

  console.log(`Connection String: ${connectionString}`);
  console.log(`Container Name: ${containerName}`);

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Ensure the container exists
  const containerExists = await containerClient.exists();
  if (!containerExists) {
    await containerClient.create();
    console.log(`Container ${containerName} created.`);
  } else {
    console.log(`Container ${containerName} already exists.`);
  }

  const uploadPromises = files.map(async (file) => {
    const blobName = uuidv4() + '-' + file.name;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const arrayBuffer = await file.arrayBuffer();

    console.log(`Uploading file: ${blobName}`);

    try {
      await blockBlobClient.uploadData(arrayBuffer);
      console.log(`File ${blobName} uploaded to ${blockBlobClient.url}`);

      const sasOptions = {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse('r'), // Read-only permissions
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 86400 * 1000), // Token valid for 24 hours
      };
      const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
      const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

      const blobUrlWithSas = `${blockBlobClient.url}?${sasToken}`;
      console.log(`File ${blobName} can be accessed at ${blobUrlWithSas}`);

      return blobUrlWithSas;
    } catch (error) {
      // @ts-ignore
      console.error(`Failed to upload file ${blobName}:`, error.message);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
};
