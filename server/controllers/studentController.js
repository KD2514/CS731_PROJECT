const Course = require('../models/courseModel');
const User = require('../models/userModel');

exports.getUserCourses = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const courses = await Course.find({ 'students.email': email });
    res.status(200).json({ user, courses });
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ message: 'Failed to fetch user courses', error });
  }
};


exports.getStudents = async (req, res) => {
    try {
      const students = await User.find({ role: 'student' });
      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Failed to fetch students', error });
    }
}


