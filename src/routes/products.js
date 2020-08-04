const { Router } = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getImagesByProduct } = require('../controllers/product.controller');
const verifyToken = require('../middlewares/verify.token');
const router = Router();

router.post('/', verifyToken,createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', verifyToken,updateProduct);
router.delete('/:id', verifyToken,deleteProduct);
router.get('/:id/images', getImagesByProduct);

module.exports = router;