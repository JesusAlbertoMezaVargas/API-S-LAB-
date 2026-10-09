const router = require('express').Router();
const c = require('../controllers/instituto.controller');

// Institutos (las rutas /bulk van ANTES de /:id)
router.get('/', c.getAll);
router.post('/', c.create);
router.post('/bulk', c.createMany);
router.put('/bulk', c.updateMany);
router.delete('/bulk', c.removeMany);
router.get('/:id', c.getById);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

// Carreras (subdocumento)
router.get('/:id/carreras', c.getCarreras);
router.post('/:id/carreras', c.addCarrera);
router.post('/:id/carreras/bulk', c.addCarreras);
router.put('/:id/carreras/bulk', c.updateCarreras);
router.delete('/:id/carreras/bulk', c.removeCarreras);
router.get('/:id/carreras/:subId', c.getCarrera);
router.put('/:id/carreras/:subId', c.updateCarrera);
router.delete('/:id/carreras/:subId', c.removeCarrera);

module.exports = router;