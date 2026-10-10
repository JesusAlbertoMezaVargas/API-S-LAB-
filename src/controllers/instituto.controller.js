const mongoService = require('../services/instituto.mongo.service');
const supabaseService = require('../services/instituto.supabase.service');

// La BD viene en el token JWT (req.db) y se elige al iniciar sesión
const getService = (req) => (req.db === 'supabase' ? supabaseService : mongoService);

const ok = (res, data, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, message, data });

const notFound = (res, que = 'Registro') =>
  res.status(404).json({ success: false, message: `${que} no encontrado` });

const fail = (res, e) => {
  let status = 500;
  if (['CastError', 'ValidationError'].includes(e.name)) status = 400;
  if (e.code === '22P02') status = 400;
  if (e.code === 11000 || e.code === '23505') status = 409;
  res.status(status).json({ success: false, message: 'Error en la operación', error: e.message });
};

const wrap = (fn) => async (req, res) => {
  try { await fn(req, res); } catch (e) { fail(res, e); }
};

// ---------- INSTITUTOS ----------
exports.getAll = wrap(async (req, res) =>
  ok(res, await getService(req).getAll()));

exports.getById = wrap(async (req, res) => {
  const data = await getService(req).getById(req.params.id);
  return data ? ok(res, data) : notFound(res, 'Instituto');
});

exports.create = wrap(async (req, res) =>
  ok(res, await getService(req).create(req.body), 'Instituto creado', 201));

exports.createMany = wrap(async (req, res) => {
  const registros = await getService(req).createMany(req.body);
  ok(res, { insertados: registros.length, registros }, 'Institutos creados', 201);
});

exports.update = wrap(async (req, res) => {
  const data = await getService(req).update(req.params.id, req.body);
  return data ? ok(res, data, 'Instituto actualizado') : notFound(res, 'Instituto');
});

exports.updateMany = wrap(async (req, res) =>
  ok(res, await getService(req).updateMany(req.body), 'Institutos actualizados'));

exports.remove = wrap(async (req, res) => {
  const done = await getService(req).remove(req.params.id);
  return done ? ok(res, { eliminado: true, id: req.params.id }, 'Instituto eliminado')
              : notFound(res, 'Instituto');
});

exports.removeMany = wrap(async (req, res) =>
  ok(res, await getService(req).removeMany(req.body.ids), 'Institutos eliminados'));

// ---------- CARRERAS ----------
exports.getCarreras = wrap(async (req, res) => {
  const data = await getService(req).getCarreras(req.params.id);
  return data ? ok(res, data) : notFound(res, 'Instituto');
});

exports.getCarrera = wrap(async (req, res) => {
  const data = await getService(req).getCarrera(req.params.id, req.params.subId);
  return data ? ok(res, data) : notFound(res, 'Carrera');
});

exports.addCarrera = wrap(async (req, res) => {
  const carrera = await getService(req).addCarrera(req.params.id, req.body);
  return carrera ? ok(res, carrera, 'Carrera agregada', 201) : notFound(res, 'Instituto');
});

exports.addCarreras = wrap(async (req, res) => {
  const carreras = await getService(req).addCarreras(req.params.id, req.body);
  return carreras ? ok(res, { insertados: carreras.length, carreras }, 'Carreras agregadas', 201)
                  : notFound(res, 'Instituto');
});

exports.updateCarrera = wrap(async (req, res) => {
  const carrera = await getService(req).updateCarrera(req.params.id, req.params.subId, req.body);
  return carrera ? ok(res, carrera, 'Carrera actualizada') : notFound(res, 'Carrera');
});

exports.updateCarreras = wrap(async (req, res) =>
  ok(res, await getService(req).updateCarreras(req.params.id, req.body), 'Carreras actualizadas'));

exports.removeCarrera = wrap(async (req, res) => {
  const done = await getService(req).removeCarrera(req.params.id, req.params.subId);
  return done ? ok(res, { eliminado: true, id: req.params.subId }, 'Carrera eliminada')
              : notFound(res, 'Carrera');
});

exports.removeCarreras = wrap(async (req, res) => {
  const r = await getService(req).removeCarreras(req.params.id, req.body.ids);
  return r ? ok(res, r, 'Carreras eliminadas') : notFound(res, 'Instituto');
});