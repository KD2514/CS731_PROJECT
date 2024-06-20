const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacherId: { type: String, required: true},
  courseID: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  credits: { type: Number, required: true },
  coverImage: String,
  students: [String],
  materials: [{ week: String, note: String, file: String }]
});

module.exports = mongoose.model('Course', CourseSchema);
