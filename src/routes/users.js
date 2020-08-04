const { Router } = require('express');
const { createUser, login, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verify.token');
const router = Router();

router.post('/', verifyToken, createUser);
router.post('/login', login);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', verifyToken,updateUser);
router.delete('/:id', verifyToken, deleteUser);

module.exports = router;