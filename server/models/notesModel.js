const mongoose = require('mongoose');
const NotesSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  week: { type: Number, required: true },
  filesLink: { type: [String], required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notes', NotesSchema);
