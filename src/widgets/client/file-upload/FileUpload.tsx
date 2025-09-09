import {
  apiCancelUpload,
  apiInitUpload,
  apiUploadChunk,
  calculateCRC32,
  CHUNK_SIZE,
} from "@/app/api/post-file";
import { ClientContext } from "@/providers/ClientProvider";
import { AppData } from "@/shared/ui/app-data/AppData";
import { FC, useContext, useEffect, useState } from "react";

interface FileUploadProps {}

export const FileUpload: FC<FileUploadProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileValue, setFileValue] = useState<string>("");

  const { teleuserAuthorized } = useContext(ClientContext);

  const handleOnSendMessageWithFile = async (message: string) => {
    if (file && teleuserAuthorized) {
      const uploadId = await apiInitUpload(file, "1739197350166203", message);

      if (uploadId !== 0 && uploadId) {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
          const start = chunkNumber * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);
          const chunkCrc32 = await calculateCRC32(chunk);

          const isUploaded = await apiUploadChunk(
            uploadId,
            chunk,
            chunkNumber,
            chunkCrc32
          );

          await new Promise((resolve) => setTimeout(resolve, 100));

          if (!isUploaded) {
            await apiCancelUpload(uploadId);
            return;
          }
        }
      }

      setFile(null);
      setFileValue("");
    }
  };

  const onAttach = async () => {
    if (fileValue.length) {
      try {
        const json = JSON.parse(JSON.stringify(fileValue));
        console.log("json parsed", json);
        const file = new File([JSON.stringify(json, null, 2)], "data.json", {
          type: "application/json",
        });

        setFile(file);
      } catch (error) {
        console.error("Error occured when loading file:", error);
      }
    }
  };

  useEffect(() => {
    if (file) {
      (async () => {
        await handleOnSendMessageWithFile("file uploading");
      })();
    }
  }, [file]);

  return (
    <AppData
      testIdCard={"UPLOAD_FILE_CARD"}
      testIdBtn={"UPLOAD_FILE_BTN"}
      value={fileValue}
      nameBtn="Upload file"
      onChange={setFileValue}
      title="Upload file"
      color="light"
      onSubmit={onAttach}
    />
  );
};
