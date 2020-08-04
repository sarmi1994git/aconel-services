const { Router } = require('express');
const { createService, getServices, getServiceById, updateService, deleteService } = require('../controllers/service.controller');
const verifyToken = require('../middlewares/verify.token');
const router = Router();

router.post('/', verifyToken,createService);
router.get('/', getServices);
router.get('/:id', getServiceById);
router.put('/:id', verifyToken,updateService);
router.delete('/:id', verifyToken,deleteService);

module.exports = router;

