const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const DB_VALIDAS = ['mongodb', 'supabase'];

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ success: false, message: 'nombre, email y password son obligatorios' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await Usuario.create({ nombre, email, password: hash });
    res.status(201).json({
      success: true,
      message: 'Usuario registrado',
      data: { _id: user._id, nombre: user.nombre, email: user.email }
    });
  } catch (e) {
    const status = e.code === 11000 ? 409 : 500;
    res.status(status).json({ success: false, message: 'Error al registrar', error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, db } = req.body;
    if (!email || !password || !db) {
      return res.status(400).json({ success: false, message: 'email, password y db son obligatorios' });
    }
    if (!DB_VALIDAS.includes(db)) {
      return res.status(400).json({ success: false, message: `db debe ser: ${DB_VALIDAS.join(' o ')}` });
    }
    const user = await Usuario.findOne({ email: email.toLowerCase() });
    const valido = user && await bcrypt.compare(password, user.password);
    if (!valido) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, db },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({
      success: true,
      message: 'Login exitoso',
      data: { token, db, usuario: { nombre: user.nombre, email: user.email } }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al iniciar sesión', error: e.message });
  }
};