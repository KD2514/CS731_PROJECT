const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const NoteController = require('../controllers/noteController.js');
const upload = require('../middleware/uploadmiddleware');
const { authenticateUser, authorizeRoles } = require('../middleware/authenticateUser');

router.post('/upload', authenticateUser, authorizeRoles('teacher'), upload.array('assignment', 10), courseController.saveAssignment);
router.put('/remove-assignment', authenticateUser, authorizeRoles('teacher'), NoteController.deleteNoteByFileLink)
router.post('/create-course', authenticateUser, authorizeRoles('teacher'), upload.single('coverImage'), courseController.createCourse);
router.get('/', courseController.getCourses);
router.put('/edit/:courseId', authenticateUser, authorizeRoles('teacher'), upload.single('coverImage'), courseController.editCourse);
router.delete('/delete/:courseId', authenticateUser, authorizeRoles('teacher'), courseController.deleteCourse);
router.get('/:courseId', authenticateUser, courseController.getCourseById);
router.get('/:teacherId', authenticateUser, authorizeRoles('teacher'), courseController.getCourseByTId);
router.put('/add-student', authenticateUser, courseController.addStudentToCourse);
router.put('/remove-student', authenticateUser, courseController.removeStudentFromCourse);
router.get('/getAssignment/:courseId', authenticateUser, courseController.getAssignmentByCourseId)

module.exports = router;
