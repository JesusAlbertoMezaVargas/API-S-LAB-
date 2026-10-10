const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token requerido' });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    req.db = payload.db; // "mongodb" | "supabase"
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};