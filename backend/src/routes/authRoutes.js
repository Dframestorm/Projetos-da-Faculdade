const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define a rota POST para registro de usuário
router.post('/register', authController.register);

// Define a rota POST para login de usuário
router.post('/login', authController.login);

module.exports = router;