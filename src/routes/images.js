const { Router } = require('express');
const { createImage, getImages, getImageById, updateImage, deleteImage, getImagesByName } = require('../controllers/image.controller');
const verifyToken = require('../middlewares/verify.token');
const upFile = require('../middlewares/multer');
const router = Router();

router.post('/', verifyToken, createImage);
router.get('/', getImages);
router.get('/:id', getImageById);
router.put('/:id', verifyToken,updateImage);
router.delete('/:id', verifyToken,deleteImage);

module.exports = router;