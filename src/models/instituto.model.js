const mongoose = require('mongoose');

const CarreraSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  clave: { type: String, required: true },
  duracionSemestres: { type: Number, default: 9 },
  activa: { type: Boolean, default: true }
});

const InstitutoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  clave: { type: String, required: true, unique: true },
  ciudad: { type: String },
  estado: { type: String },
  activo: { type: Boolean, default: true },
  carreras: [CarreraSchema]
}, { timestamps: true });

module.exports = mongoose.model('Instituto', InstitutoSchema);