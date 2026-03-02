const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getActiveAwards,
  getAwardMonths,
  getAllAwards,
  createAward,
  updateAward,
  deleteAward
} = require('../controllers/awards.controller');

// Public
router.get('/', getActiveAwards);
router.get('/months', getAwardMonths);

// Admin
router.get('/admin/all', authenticate, authorize('admin'), getAllAwards);
router.post('/', authenticate, authorize('admin'), createAward);
router.put('/:id', authenticate, authorize('admin'), updateAward);
router.delete('/:id', authenticate, authorize('admin'), deleteAward);

module.exports = router;
