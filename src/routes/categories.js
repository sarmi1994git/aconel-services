const { Router } = require('express');
const { createCategory, getCategories, getCategoryById, getCategoryBySlug, updateCategory, deleteCategory, getProductsByCategory } = require('../controllers/category.controller');
const verifyToken = require('../middlewares/verify.token');
const router = Router();

router.post('/', verifyToken,createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id/products', getProductsByCategory);
router.put('/:id', verifyToken,updateCategory);
router.delete('/:id', verifyToken,deleteCategory);

module.exports = router;