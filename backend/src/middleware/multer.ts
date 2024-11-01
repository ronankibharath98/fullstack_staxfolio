import multer from 'multer';

const storage = multer.memoryStorage()
export const sigleUpload = multer({storage}).single("file");
