const Instituto = require('../models/instituto.model');

// ---------- INSTITUTOS ----------
exports.getAll = () => Instituto.find();
exports.getById = (id) => Instituto.findById(id);
exports.create = (data) => Instituto.create(data);
exports.createMany = (arr) => Instituto.insertMany(arr);
exports.update = (id, data) =>
  Instituto.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
exports.updateMany = (arr) =>
  Instituto.bulkWrite(arr.map(({ _id, ...campos }) => ({
    updateOne: { filter: { _id }, update: { $set: campos } }
  })));
exports.remove = (id) => Instituto.findByIdAndDelete(id);
exports.removeMany = (ids) => Instituto.deleteMany({ _id: { $in: ids } });

// ---------- CARRERAS (subdocumento) ----------
exports.getCarreras = async (id) => {
  const inst = await Instituto.findById(id).select('carreras');
  return inst ? inst.carreras : null;
};
exports.getCarrera = async (id, subId) => {
  const inst = await Instituto.findById(id);
  return inst ? inst.carreras.id(subId) : null;
};
exports.addCarrera = (id, carrera) =>
  Instituto.findByIdAndUpdate(id, { $push: { carreras: carrera } },
    { new: true, runValidators: true });
exports.addCarreras = (id, arr) =>
  Instituto.findByIdAndUpdate(id, { $push: { carreras: { $each: arr } } },
    { new: true, runValidators: true });

const setCarrera = (campos) => {
  const set = {};
  Object.keys(campos).forEach((k) => { set[`carreras.$.${k}`] = campos[k]; });
  return set;
};
exports.updateCarrera = (id, subId, data) =>
  Instituto.findOneAndUpdate(
    { _id: id, 'carreras._id': subId },
    { $set: setCarrera(data) },
    { new: true });
exports.updateCarreras = (id, arr) =>
  Instituto.bulkWrite(arr.map(({ _id, ...campos }) => ({
    updateOne: {
      filter: { _id: id, 'carreras._id': _id },
      update: { $set: setCarrera(campos) }
    }
  })));
exports.removeCarrera = (id, subId) =>
  Instituto.findByIdAndUpdate(id, { $pull: { carreras: { _id: subId } } }, { new: true });
exports.removeCarreras = (id, ids) =>
  Instituto.findByIdAndUpdate(id, { $pull: { carreras: { _id: { $in: ids } } } }, { new: true });