const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Adicione esta linha para permitir solicitações de qualquer origem
app.use(express.json());

// Importando ROTAS do arquivo AUTH
const authRoutes = require('../src/routes/auth');

// Usando Rotas
app.use('/auth', authRoutes);

// Adicionar a rota de verificação de autenticação


// Abaixo definimos nossa porta e fazemos o server escutar nossa porta
const port = 8080;

app.listen(port, () => console.log(`Rodando com express na porta: ${port}!`));

module.exports = app;
