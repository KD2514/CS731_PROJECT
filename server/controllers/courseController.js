const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Notes = require('../models/notesModel');
const mongoose = require("mongoose");

//create a new course
exports.createCourse = async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied: only teachers can create courses' });
  }
  const { name, courseID, description, duration, credits } = req.body;
  const course = await Course.findOne({ courseID })
  if (course) {
    return res.status(403).json({ message: 'already created with this course id' });
  }
  if (!name && !courseID && description && duration && credits) {
    return res.status(403).json({ message: 'plz fill all the details' });
  }
  const coverImage = req.file ? `/uploads/${req.file.filename}` : '';

  const newCourse = new Course({ name, teacherId: req.user.id, teacherName: req.user.userName, courseID, description, duration, coverImage, credits });
  try {
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course', error });
  }
};

//edit course
exports.editCourse = async (req, res) => {
  const { courseId } = req.params;
  const { name, description, duration, credits } = req.body;

  if (!name && !courseId && description && duration && credits) {
    return res.status(403).json({ message: 'plz fill all the details' });
  }
  // Use a ternary operator to set the coverImage if a file is uploaded
  const coverImage = req.file ? `/uploads/${req.file.filename}` : '';

  console.log(name, description, duration, credits, coverImage)
  try {
    // Find the course by ID
    const course = await Course.findOne({ courseID: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update the course details
    course.name = name !== undefined ? name : course.name;
    course.description = description !== undefined ? description : course.description;
    course.duration = duration !== undefined ? duration : course.duration;
    course.credits = credits !== undefined ? credits : course.credits;
    course.coverImage = coverImage || course.coverImage;

    // Save the updated course
    await course.save();

    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Error editing course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//delete course
exports.deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.user.id; // Assuming req.user contains the authenticated user's info

  try {
    // Find the course by ID
    const course = await Course.deleteOne({ courseID: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }


    // Delete all notes related to this course
    await Note.deleteOne({ course: courseId });

    // Delete the course
    // await course.remove();

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//get all course
exports.getCourses = async (req, res) => {
  try {
    const { studentId, teacherId } = req.query;
    const filter = {};

    if (studentId) {
      filter.students = studentId;
    }

    if (teacherId) {
      filter.teacherId = teacherId;
    }

    const courses = await Course.find(filter);
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses', error });
  }
};
//getCourse by id
exports.getCourseById = async (req, res) => {
  try {
    console.log("i get executed", req.params.courseId)
    const course = await Course.findById(req.params.courseId);
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Failed to fetch course', error });
  }
};

//get course bt teacher id
exports.getCourseByTId = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const course = await Course.find({ teacherId: teacherId })
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Failed to fetch course', error });
  }
}


//registration students
exports.registerStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, studentId } = req.body;
  if (!name && !email && !studentId) {
    return res.status(403).json({ message: 'plz fill all the details' });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      const newUser = new User({ email, password: await bcrypt.hash('defaultpassword', 10), id: studentId, role: 'student' });
      user = await newUser.save();
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.students.push({ name, email, id: studentId });
    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'Failed to register student', error });
  }
};


// add student
exports.addStudentToCourse = async (req, res) => {
  const { courseId, studentId } = req.body;
  const teacherId = req.user.id;

  try {
    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Ensure the logged-in user is the teacher who created the course
    if (course.teacherId !== teacherId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if the student is already enrolled in the course
    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student is already enrolled in this course' });
    }

    // Add the student to the course
    course.students.push(studentId);
    await course.save();

    // Add the course to the student's course list
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    student.courses.push(courseId);
    await student.save();

    res.status(200).json({ message: 'Student added to course successfully', course });
  } catch (error) {
    console.error('Error adding student to course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//remove students from the course
exports.removeStudentFromCourse = async (req, res) => {
  const { courseId, studentId } = req.body;
  const teacherId = req.user.id; // Assuming req.user contains the authenticated user's info

  try {
    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Ensure the logged-in user is the teacher who created the course
    if (course.teacherId !== teacherId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if the student is enrolled in the course
    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student is not enrolled in this course' });
    }

    // Remove the student from the course
    course.students.pull(studentId);
    await course.save();

    // Remove the course from the student's course list
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    student.courses.pull(courseId);
    await student.save();

    res.status(200).json({ message: 'Student removed from course successfully', course });
  } catch (error) {
    console.error('Error removing student from course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.saveAssignment = async (req, res) => {
  const { courseId, week } = req.body;

  try {
    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log("req.files", req.files)
    const filesLink = []
    req.files.map((file) => {
      filesLink.push(`/uploads/${file.filename}`);
    })

    const note = new Notes({
      filesLink,
      week,
      courseId,
    });
    await note.save();

    res.status(201).json({ message: 'Note shared successfully', note });
  } catch (error) {
    console.error('Error sharing note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//get assignment by course id
exports.getAssignmentByCourseId = async (req, res) => {
  const { courseId } = req.params
  console.log(courseId)
  try {
    const Note = await Notes.find({ courseId: courseId })

    res.status(200).json(Note)
  } catch (error) {
    console.log('Error getting assignment', error);
    res.status(500).json({ message: 'internal server error' })
  }
}