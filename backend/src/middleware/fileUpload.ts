import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});

const fileFilter = function (req: any, file: any, cb: any) {
  // check file type
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG and PNG image files are allowed"));
  }

  cb(null, true);
};

const limits = {
  fileSize: 1024 * 1024 * 5, // 5 MB
};

export const upload = multer({ storage: storage, fileFilter: fileFilter, limits: limits });