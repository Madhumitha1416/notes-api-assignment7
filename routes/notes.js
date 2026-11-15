const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/Note');

const router = express.Router();

// Centralised error handler: 400 for validation/cast errors, 500 otherwise
function handleError(res, err) {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for ${err.path}` });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}

// Reject malformed ids before hitting the database
function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/notes  (optional ?category=Work)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      const allowed = Note.schema.path('category').enumValues;
      if (!allowed.includes(req.query.category)) {
        return res
          .status(400)
          .json({ error: `Category must be one of: ${allowed.join(', ')}` });
      }
      filter.category = req.query.category;
    }
    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    handleError(res, err);
  }
});

// GET /api/notes/:id
router.get('/:id', async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.status(200).json(note);
  } catch (err) {
    handleError(res, err);
  }
});

// POST /api/notes
router.post('/', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const note = new Note({ title, content, category });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    handleError(res, err);
  }
});

// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }
    const { title, content, category } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.status(200).json(note);
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.status(200).json({ message: 'Note deleted successfully', note });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
