import { BlobServiceClient } from '@azure/storage-blob';

export async function uploadProductImage(file) {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER || 'product-images';
  if (!conn) throw new Error('Missing AZURE_STORAGE_CONNECTION_STRING');

  const service = BlobServiceClient.fromConnectionString(conn);
  const container = service.getContainerClient(containerName);
  await container.createIfNotExists({ access: 'blob' });

  const ext = file.name?.split('.').pop() || 'jpg';
  const blobName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const blockBlob = container.getBlockBlobClient(blobName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await blockBlob.uploadData(bytes, { blobHTTPHeaders: { blobContentType: file.type } });
  return blockBlob.url;
}
