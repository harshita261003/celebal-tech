const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  assignedTo: String,
  attachments: [String],
});

const ListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cards: [CardSchema],
});

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lists: [ListSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Board', BoardSchema);
