import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from 'firebase/storage';
import { getCurrentDateTime } from './datetime';

export const uploadFiles = async (files: Express.Multer.File[], folder?: string) => {
  const dateTime = getCurrentDateTime();
  const storage = getStorage();
  const fileURL: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const storageRef = ref(storage, `files/${files[i]?.originalname}-${dateTime}`);
    // Create file metadata including the content type
    const metadata = {
      contentType: files[i]?.mimetype,
    };
    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(storageRef, files[i]?.buffer, metadata);
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
    const downloadURL = await getDownloadURL(snapshot.ref);
    fileURL.push(downloadURL);
  }

  return fileURL;
};

export const uploadSingleFile = async (file: any, folder?: string) => {
  const dateTime = getCurrentDateTime();
  const storage = getStorage();

  const storageRef = ref(storage, `${folder}/${file.originalname}-${dateTime}`);
  const metadata = {
    contentType: file.mimetype,
  };
  // Upload the file in the bucket storage
  const snapshot = await uploadBytesResumable(storageRef, file?.buffer, metadata);
  //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

export const getListAllFilesStorage = async (folderName: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, folderName);
  try {
    const res = await listAll(storageRef);
    const urls = await Promise.all(res.items.map((itemRef) => getDownloadURL(itemRef)));
    return urls;
  } catch (error) {
    console.error('Error listing files:', error);
  }
};

const extractFilePath = (url: string) => {
  const match = url.match(/\/o\/(.*?)\?alt=media/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  } else {
    throw new Error('Invalid URL format');
  }
};

export const removeUploadedFile = async (url: string) => {
  const storage = getStorage();

  const urlRef = extractFilePath(url);
  // Create a reference to the file to delete
  const desertRef = ref(storage, urlRef);

  console.log(urlRef);

  // deleteObject(desertRef)
  //   .then(() => {
  //     // File deleted successfully
  //     console.log(`File deleted successfully`);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};
