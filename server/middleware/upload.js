const multer = require('multer');

let cloudinaryStorage = null;
let cloudinaryInstance = null;

const getStorage = () => {
  if (!cloudinaryStorage) {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    cloudinaryInstance = cloudinary;

    cloudinaryStorage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => ({
        folder: 'fullstack-app',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
        public_id: `item_${Date.now()}`,
      }),
    });
  }
  return cloudinaryStorage;
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'), false);
  }
};

const getUpload = () => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return multer({ storage: multer.memoryStorage(), fileFilter });
  }
  return multer({
    storage: getStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
  });
};

const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl || !cloudinaryInstance) return;
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const publicId = `fullstack-app/${filename}`;
    await cloudinaryInstance.uploader.destroy(publicId);
  } catch (err) {
    console.error('Failed to delete image:', err.message);
  }
};

module.exports = { getUpload, deleteImage };
