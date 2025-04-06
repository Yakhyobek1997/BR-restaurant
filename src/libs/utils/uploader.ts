import path from "path";               // Fayl kengaytmasini olish uchun
import multer from "multer";           // Fayl yuklash uchun kutubxona
import { v4 } from "uuid";             // Yagona, random fayl nomi yaratish uchun (collision oldini olish)


/** MULTER IMAGE UPLOADER **/
function getTargetImageStorage(address: any) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./uploads/${address}`); 
      // Fayllar `uploads/` papkasiga, masalan `uploads/products/` ga saqlanadi
    },

    filename: function (req, file, cb) {
      const extension = path.parse(file.originalname).ext; 
      // Yuborilgan fayl nomidan kengaytmani ajratib olamiz (masalan: .jpg, .png)

      const random_name = v4() + extension; 
      // UUID orqali noyob fayl nomi yasaymiz, masalan: 'b19f4c2e-3b12-4cf7.png'

      cb(null, random_name); 
      // callback orqali fayl nomini multerga yuboramiz
    },
  });
}

  const makeUploader = (address: string) => {
    const storage = getTargetImageStorage(address); 
    // Yuklash uchun fayl saqlash sozlamalarini olamiz
  
    return multer({ storage: storage }); 
    // Multer'ni kerakli storage bilan qaytaramiz
  };
  
  
  export default makeUploader;
  


  

/*

const router = express.Router();

const product_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/products");
  },
  filename: function (req, file, cb) {
    const extension = path.parse(file.originalname).ext;
    const random_name = v4() + extension;
    cb(null, random_name);
  },
});

export const uploadProductImage = multer({ storage: product_storage });

*/