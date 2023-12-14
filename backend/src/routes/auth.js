// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/User')
const router = express.Router();

//Rota LOGIN
router.post('/admin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && bcrypt.compareSync(password, user.password)) {
        // Senha correta
        res.json({ success: true, message: 'Login successful' });
        }   else {
        // Senha incorreta
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
    }
});

//Rota pra registro

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
      // Verifica se o usuário já existe
        const existingUser = await User.findOne({ email });

        if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists' });
        }

      // Hash da senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(password, 10);
        
      // Cria um novo usuário
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.json({ success: true, message: 'User registered successfully' });
        } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

//Rota para autenticaçao se user === logado
router.get('/check-auth', (req, res) => {
  // Verificar se o usuário está autenticado aqui
  if (req.user) {
    // Se estiver autenticado, retorne sucesso
    res.json({ success: true });
  } else {
    // Se não estiver autenticado, retorne falha
    res.json({ success: false });
  }
});

module.exports = router;
