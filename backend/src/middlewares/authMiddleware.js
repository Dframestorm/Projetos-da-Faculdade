const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Pega o token do cabeçalho da requisição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  // O padrão do token é "Bearer <TOKEN>"
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Erro no token. Formato inválido.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token malformado.' });
  }

  // 2. Verifica se o token é válido
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Se o token for válido, ele decodifica o token e coloca as informações do usuário na requisição (req)
    // Assim, os próximos controllers saberão QUEM está fazendo a ação
    req.userId = decoded.id;
    req.userRole = decoded.role;

    // Se o token estiver ok, o 'next()' autoriza a requisição a seguir para o Controller
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};