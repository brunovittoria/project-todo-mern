// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')


function createAuthRoutes(secretKey) {
    const router = express.Router();

//Rota pra verificar LOGIN
router.post('/admin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && bcrypt.compareSync(password, user.password)) {
        // Senha correta
        // Gerar token JWT e definir no cookie para que passe para ADMIN direto sem logar
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' })
        res.cookie('token', token, { httpOnly: true });

        // Marcar o usuário como logado no banco de dados
        await User.findByIdAndUpdate(user._id, { isLoggedIn: true })

        res.json({ success: true, message: 'Login successful' });
        } else {
        // Senha incorreta
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
    }

});

//Rota pra verificar se usuario ta logado:
router.get('/check-auth', async (req, res) => {
    console.log('Check Auth Route Called')
    try {
      // Verificar se o token está presente nos cookies
        const token = req.cookies.token;

        if (!token) {
          // Se não houver token, o usuário não está autenticado
            console.log('No token found')
            return res.json({ success: false });
        }

        // Verificar a validade do token
        jwt.verify(token, 'suaChaveSecreta', async (err, decoded) => {
        if (err) {
            // Se houver um erro ao verificar o token, o usuário não está autenticado
            console.error('Error verifying token:', err)
            return res.json({ success: false });
        }
        
        // O token é válido, o usuário está autenticado
        console.log('Token verified successfully')
        res.json({ success: true });
        });
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
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

return router
}

module.exports = createAuthRoutes;
