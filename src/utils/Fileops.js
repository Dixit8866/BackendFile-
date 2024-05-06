import fs from "fs/promises";
import abc from "fs";
import path from "path";
import { uploadDirectory } from "../middleware/multer.js";

export const writeFile = async (dirctoryName, fileName, data) => {
  const directoryPath = path.join(uploadDirectory, dirctoryName);
  if (!abc.existsSync(directoryPath)) {
    abc.mkdirSync(directoryPath);
  }
  const fullPath = path.join(directoryPath, fileName);
  await fs.writeFile(fullPath, data);
  return fullPath;
};

export const deleteFile = async (filePath) => {
  const fullPath = path.join(uploadDirectory, filePath);
  try {
    const abc = await fs.unlink(fullPath);
    console.log(abc, "abc");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("File does not exist, cannot delete:", fullPath);
    } else {
      throw error;
    }
  }
};

export const processImage = async (dirctoryName, Image) => {
  const fileExt = path.extname(Image.originalname);
  if (Image.fieldname === "thumbnailImage") {
    const fileName = `ThumbnailImage-${
      Math.floor(Math.random() * 9000000000) + 1000000000
    }${fileExt}`;
    await writeFile(dirctoryName, fileName, Image.buffer);
    return path.join(dirctoryName, fileName);
  } else {
    const fileName = `SubImage-${
      Math.floor(Math.random() * 9000000000) + 1000000000
    }${fileExt}`;
    await writeFile(dirctoryName, fileName, Image.buffer);
    return path.join(dirctoryName, fileName);
  }
};
