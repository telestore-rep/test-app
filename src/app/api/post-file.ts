import { Crc32 } from "@/shared/helpers/crc32";

export const CHUNK_SIZE = 256 * 1024;

export async function apiInitUpload(file: File, chatId: string, message: string = ""): Promise<number | null> {
  var uploadId: number | null = null;
  const fileName = file.name;
  const fileSize = file.size;
  const crc32 = await calculateCRC32(file);

  const response = await fetch("https://dev.tele.store:8081/auth/v1/file/init_upload", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileName, fileSize, chatId, crc32, message })
  });

  if (response.ok) {
    const data = await response.json();

    uploadId = data.result as number;
    console.log("Upload initialized with ID:", uploadId);
  }

  return uploadId;
}

export async function apiUploadChunk(uploadId: number, chunk: Blob, chunkNumber: number, chunkCrc32: number) {
  const formData = new FormData();
  formData.append("fileChunk", chunk);

  const response = await fetch(`https://dev.tele.store:8081/auth/v1/file/upload_part?uploadId=${uploadId}&chunkNumber=${chunkNumber}&chunkCrc32=${chunkCrc32}`, {
    method: "POST",
    credentials: "include",
    body: chunk
  });

  return response.ok;
}

export async function apiCancelUpload(uploadId: number) {
  if (!uploadId) return;

  const response = await fetch(`https://dev.tele.store:8081/auth/v1/file/cancel_upload?uploadId=${uploadId}`, {
    credentials: "include",
    method: "DELETE"
  });

  if (response.ok) {
    console.log("Upload cancelled");
  }
}

export async function calculateCRC32(blob: Blob) {
  const buffer = await blob.arrayBuffer();
  const crc32 = new Crc32();
  crc32.update(new Uint8Array(buffer));
  return crc32.digest();
}
