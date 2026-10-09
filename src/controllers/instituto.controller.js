const service = require('../services/instituto.service');

const ok = (res, data, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, message, data });

const notFound = (res, que = 'Registro') =>
  res.status(404).json({ success: false, message: `${que} no encontrado` });

const fail = (res, e) => {
  let status = 500;
  if (['CastError', 'ValidationError'].includes(e.name)) status = 400;
  if (e.code === 11000) status = 409;
  res.status(status).json({ success: false, message: 'Error en la operación', error: e.message });
};

const wrap = (fn) => async (req, res) => {
  try { await fn(req, res); } catch (e) { fail(res, e); }
};

// ---------- INSTITUTOS ----------
exports.getAll = wrap(async (req, res) => ok(res, await service.getAll()));

exports.getById = wrap(async (req, res) => {
  const data = await service.getById(req.params.id);
  return data ? ok(res, data) : notFound(res, 'Instituto');
});

exports.create = wrap(async (req, res) =>
  ok(res, await service.create(req.body), 'Instituto creado', 201));

exports.createMany = wrap(async (req, res) => {
  const registros = await service.createMany(req.body);
  ok(res, { insertados: registros.length, registros }, 'Institutos creados', 201);
});

exports.update = wrap(async (req, res) => {
  const data = await service.update(req.params.id, req.body);
  return data ? ok(res, data, 'Instituto actualizado') : notFound(res, 'Instituto');
});

exports.updateMany = wrap(async (req, res) => {
  const r = await service.updateMany(req.body);
  ok(res, { modificados: r.modifiedCount }, 'Institutos actualizados');
});

exports.remove = wrap(async (req, res) => {
  const data = await service.remove(req.params.id);
  return data ? ok(res, { eliminado: true, id: req.params.id }, 'Instituto eliminado')
              : notFound(res, 'Instituto');
});

exports.removeMany = wrap(async (req, res) => {
  const r = await service.removeMany(req.body.ids);
  ok(res, { eliminados: r.deletedCount }, 'Institutos eliminados');
});

// ---------- CARRERAS ----------
exports.getCarreras = wrap(async (req, res) => {
  const data = await service.getCarreras(req.params.id);
  return data ? ok(res, data) : notFound(res, 'Instituto');
});

exports.getCarrera = wrap(async (req, res) => {
  const data = await service.getCarrera(req.params.id, req.params.subId);
  return data ? ok(res, data) : notFound(res, 'Carrera');
});

exports.addCarrera = wrap(async (req, res) => {
  const inst = await service.addCarrera(req.params.id, req.body);
  if (!inst) return notFound(res, 'Instituto');
  ok(res, inst.carreras[inst.carreras.length - 1], 'Carrera agregada', 201);
});

exports.addCarreras = wrap(async (req, res) => {
  const inst = await service.addCarreras(req.params.id, req.body);
  if (!inst) return notFound(res, 'Instituto');
  ok(res, { insertados: req.body.length, carreras: inst.carreras }, 'Carreras agregadas', 201);
});

exports.updateCarrera = wrap(async (req, res) => {
  const inst = await service.updateCarrera(req.params.id, req.params.subId, req.body);
  return inst ? ok(res, inst.carreras.id(req.params.subId), 'Carrera actualizada')
              : notFound(res, 'Carrera');
});

exports.updateCarreras = wrap(async (req, res) => {
  const r = await service.updateCarreras(req.params.id, req.body);
  ok(res, { modificados: r.modifiedCount }, 'Carreras actualizadas');
});

exports.removeCarrera = wrap(async (req, res) => {
  const inst = await service.removeCarrera(req.params.id, req.params.subId);
  return inst ? ok(res, { eliminado: true, id: req.params.subId }, 'Carrera eliminada')
              : notFound(res, 'Instituto');
});

exports.removeCarreras = wrap(async (req, res) => {
  const inst = await service.removeCarreras(req.params.id, req.body.ids);
  return inst ? ok(res, { eliminados: req.body.ids.length }, 'Carreras eliminadas')
              : notFound(res, 'Instituto');
});