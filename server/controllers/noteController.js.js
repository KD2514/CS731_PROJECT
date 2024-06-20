const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Notes = require('../models/notesModel')

exports.shareNote = async (req, res) => {
    const { courseId, content } = req.body;

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Ensure the student is enrolled in the course
        if (!course.students.includes(studentId)) {
            return res.status(403).json({ message: 'Student not enrolled in this course' });
        }

        // Create the new note
        const note = new Note({
            content,
            course: courseId,
            student: studentId
        });
        await note.save();

        // Add the note to the course
        course.notes.push(note._id);
        await course.save();

        res.status(201).json({ message: 'Note shared successfully', note });
    } catch (error) {
        console.error('Error sharing note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//delete note
exports.deleteNoteByFileLink = async (req, res) => {
    try {
        const { fileLink } = req.body
        const find = await Notes.find(
            { filesLink: fileLink })
        console.log(find, fileLink,  "finding the asg")
        const result = await Notes.updateOne(
            { filesLink: fileLink }, // Filter by fileLink
            { $pull: { filesLink: fileLink } } // Remove the specific fileLink from the array
        );

        console.log(result)
        if (!result.acknowledged) {
            res.status(403).send('Assignment not found for deletion.');
        } else {
            res.status(200).send('Assignment deleted successfully.');
        }
    } catch (error) {
        console.log(error)
        res.status(400).send('Error deleting file link:', error);
    }
};

