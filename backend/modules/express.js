const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const app = express();

// Configurando o CORS para permitir solicitações com credenciais da origem http://localhost:3000
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    };

app.use(cors(corsOptions)); // Adicione esta linha para permitir solicitações de qualquer origem
app.use(express.json());
// Use o cookie-parser antes das suas rotas
app.use(cookieParser())

// Configure a chave secreta a partir de uma variável de ambiente
const secretKey = process.env.JWT_SECRET || 'suaChaveSecreta'; // Use suaChaveSecreta como valor padrão

// Importando ROTAS do arquivo AUTH
const authRoutes = require('../src/routes/auth')(secretKey);// Passa a chave secreta para o módulo de rotas
// Usando Rotas
app.use('/auth', authRoutes);

app.use('/check-auth', authRoutes);


// Adicionar a rota de verificação de autenticação

// Abaixo definimos nossa porta e fazemos o server escutar nossa porta
const port = 8080;

app.listen(port, () => console.log(`Rodando com express na porta: ${port}!`));

module.exports = app;
