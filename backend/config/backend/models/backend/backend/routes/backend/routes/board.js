const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Board = require('../models/Board');
const router = express.Router();

// Get all boards for a user
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user.id });
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new board
router.post('/', [auth, [check('title', 'Title is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title } = req.body;

  try {
    const newBoard = new Board({
      title,
      user: req.user.id,
    });

    const board = await newBoard.save();
    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a board
router.put('/:id', auth, async (req, res) => {
  const { title, lists } = req.body;

  const boardFields = {};
  if (title) boardFields.title = title;
  if (lists) boardFields.lists = lists;

  try {
    let board = await Board.findById(req.params.id);

    if (!board) return res.status(404).json({ msg: 'Board not found' });

    // Check user
    if (board.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    board = await Board.findByIdAndUpdate(req.params.id, { $set: boardFields }, { new: true });

    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a board
router.delete('/:id', auth, async (req, res) => {
  try {
    let board = await Board.findById(req.params.id);

    if (!board) return res.status(404).json({ msg: 'Board not found' });

    // Check user
    if (board.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Board.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Board removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
