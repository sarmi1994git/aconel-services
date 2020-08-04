const { Router } = require('express');
const { createContact, getContacts, updateContact, deleteContact, getContactById } = require('../controllers/contact.controller');
const verifyToken = require('../middlewares/verify.token');
const router = Router();

router.post('/', createContact);
router.get('/', getContacts);
router.get('/:id', getContactById);
router.put('/:id', verifyToken,updateContact);
router.delete('/:id', verifyToken,deleteContact);

module.exports = router;