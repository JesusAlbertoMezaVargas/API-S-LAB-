const supabase = require('../config/supabase');

// ---------- utilidades ----------
const check = ({ data, error }) => {
  if (error) throw error;
  return data;
};

const toCarrera = (r) => r && ({
  _id: r.id,
  nombre: r.nombre,
  clave: r.clave,
  duracionSemestres: r.duracion_semestres,
  activa: r.activa
});

const toInstituto = (r) => r && ({
  _id: r.id,
  nombre: r.nombre,
  clave: r.clave,
  ciudad: r.ciudad,
  estado: r.estado,
  activo: r.activo,
  carreras: (r.carreras || []).map(toCarrera),
  createdAt: r.created_at,
  updatedAt: r.updated_at
});

const pick = (obj, campos) => {
  const out = {};
  campos.forEach((c) => { if (obj[c] !== undefined) out[c] = obj[c]; });
  return out;
};

const fromInstituto = (d) => pick(d, ['nombre', 'clave', 'ciudad', 'estado', 'activo']);

const fromCarrera = (d) => {
  const out = pick(d, ['nombre', 'clave', 'activa']);
  if (d.duracionSemestres !== undefined) out.duracion_semestres = d.duracionSemestres;
  return out;
};

const existeInstituto = async (id) => {
  const data = check(await supabase.from('institutos').select('id').eq('id', id).maybeSingle());
  return !!data;
};

// ---------- INSTITUTOS ----------
exports.getAll = async () =>
  check(await supabase.from('institutos').select('*, carreras(*)')).map(toInstituto);

exports.getById = async (id) =>
  toInstituto(check(await supabase.from('institutos')
    .select('*, carreras(*)').eq('id', id).maybeSingle()));

exports.create = async (data) =>
  toInstituto(check(await supabase.from('institutos')
    .insert(fromInstituto(data)).select().single()));

exports.createMany = async (arr) =>
  check(await supabase.from('institutos')
    .insert(arr.map(fromInstituto)).select()).map(toInstituto);

exports.update = async (id, data) =>
  toInstituto(check(await supabase.from('institutos')
    .update({ ...fromInstituto(data), updated_at: new Date().toISOString() })
    .eq('id', id).select('*, carreras(*)').maybeSingle()));

exports.updateMany = async (arr) => {
  const res = await Promise.all(arr.map(async ({ _id, ...campos }) =>
    check(await supabase.from('institutos')
      .update({ ...fromInstituto(campos), updated_at: new Date().toISOString() })
      .eq('id', _id).select())));
  return { modificados: res.filter((r) => r.length > 0).length };
};

exports.remove = async (id) =>
  check(await supabase.from('institutos').delete().eq('id', id).select()).length > 0;

exports.removeMany = async (ids) => {
  const data = check(await supabase.from('institutos').delete().in('id', ids).select());
  return { eliminados: data.length };
};

// ---------- CARRERAS (tabla relacionada) ----------
exports.getCarreras = async (id) => {
  if (!(await existeInstituto(id))) return null;
  return check(await supabase.from('carreras')
    .select('*').eq('instituto_id', id)).map(toCarrera);
};

exports.getCarrera = async (id, subId) =>
  toCarrera(check(await supabase.from('carreras')
    .select('*').eq('instituto_id', id).eq('id', subId).maybeSingle()));

exports.addCarrera = async (id, carrera) => {
  if (!(await existeInstituto(id))) return null;
  return toCarrera(check(await supabase.from('carreras')
    .insert({ ...fromCarrera(carrera), instituto_id: id }).select().single()));
};

exports.addCarreras = async (id, arr) => {
  if (!(await existeInstituto(id))) return null;
  return check(await supabase.from('carreras')
    .insert(arr.map((c) => ({ ...fromCarrera(c), instituto_id: id }))).select()).map(toCarrera);
};

exports.updateCarrera = async (id, subId, data) =>
  toCarrera(check(await supabase.from('carreras')
    .update(fromCarrera(data)).eq('instituto_id', id).eq('id', subId)
    .select().maybeSingle()));

exports.updateCarreras = async (id, arr) => {
  const res = await Promise.all(arr.map(async ({ _id, ...campos }) =>
    check(await supabase.from('carreras')
      .update(fromCarrera(campos)).eq('instituto_id', id).eq('id', _id).select())));
  return { modificados: res.filter((r) => r.length > 0).length };
};

exports.removeCarrera = async (id, subId) =>
  check(await supabase.from('carreras')
    .delete().eq('instituto_id', id).eq('id', subId).select()).length > 0;

exports.removeCarreras = async (id, ids) => {
  if (!(await existeInstituto(id))) return null;
  const data = check(await supabase.from('carreras')
    .delete().eq('instituto_id', id).in('id', ids).select());
  return { eliminados: data.length };
};