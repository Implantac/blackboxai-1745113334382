const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  // roles param can be a single role string (e.g. 'admin') or an array of roles (e.g. ['admin', 'receptionist'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Acesso negado: permissão insuficiente' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  };
};

module.exports = authMiddleware;
