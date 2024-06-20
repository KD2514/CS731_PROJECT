import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Avatar,
  TextField,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Person, Schedule, School, CreditCard, ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import routes from "../helpers/routes";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom";

const MyCourses = ({ courses }) => {
  const [value, setValue] = useState(0);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [allCourses, setAllCourses] = useState(courses);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [newStudents, setNewStudents] = useState([]);
  const [assignments, setAssignments] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [assignmentFile, setAssignmentFile] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});

  const [openDialog, setOpenDialog] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [assignmentToRemove, setAssignmentToRemove] = useState(null);
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(routes.getCourse+"?teacherId="+userData.id);
      setAllCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses', error);
    }
  };
  const updateSelectedCourse = async () => {
    const updatedCourse = await axios.get(routes.getCourse + '/' + selectedCourse._id,
        { headers: { 'authorization': localStorage.getItem('token')},}
    );
    setSelectedCourse(updatedCourse.data);
  }
  const fetchStudents = async () => {
    try {
      const response = await axios.get(routes.getStudents);
      console.log("all Students", response.data)
      setAllStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const getAssignment = async () => {
    const response = await axios.get(`${routes.getAssignment}/${selectedCourse._id}`, {
      headers: {
        'authorization': localStorage.getItem('token')
      },
    });
    const allAssignments = {}
    for (let i = 1; i <= selectedCourse.duration; i++) {
      allAssignments[i] = [];
    }
    response.data.map((asg) => {
      if (!allAssignments[asg.week]) {
        allAssignments[asg.week] = [];
      }
      allAssignments[asg.week].push(...asg.filesLink);
    });
    setAssignments(allAssignments)
    console.log(allAssignments)
  }
  useEffect(() => {
    if(selectedCourse) {
      getAssignment()
    }
  }, [selectedCourse])

  const studentsNote = () => {
    const notSelectedStudents = allStudents.filter((students) => !selectedCourse.students.includes((students._id)) )
    const SelectedStudents = allStudents.filter((students) => selectedCourse.students.includes((students._id)) )
    setNewStudents(notSelectedStudents)
    setEnrolledStudents(SelectedStudents)
    console.log("notSelectedStudents", allStudents, notSelectedStudents)
  }
  useEffect(() => {
    studentsNote()
  }, [selectedCourse])

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleWeekClick = (week) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  const handleRegisterStudent = async () => {
    const selectedStudentDetails = allStudents.find(student => student._id === selectedStudent);

    if (!selectedStudentDetails) {
      setErrorMessages(prev => ({ ...prev, general: 'Please select a student' }));
      return;
    }

    try {
      const response = await axios.put(routes.registerUser,
          {courseId:selectedCourse._id, studentId : selectedStudent},
          { headers: { 'authorization': localStorage.getItem('token')},}
      );
      setSelectedStudent('');
      alert('Student registered successfully');
      await updateSelectedCourse()
    } catch (error) {
      console.error('Error registering student:', error.response ? error.response.data : error.message);
      setErrorMessages(prev => ({ ...prev, general: 'Failed to register student' }));
    }
  };

  const handleConfirmRemoveStudent = (studentId) => {
    setStudentToRemove(studentId);
    setOpenDialog(true);
  };

  const handleRemoveStudent = async () => {
    setOpenDialog(false);

    try {
      const response = await axios.put(routes.removeUser,
          {courseId:selectedCourse._id, studentId: studentToRemove},
          { headers: { 'authorization': localStorage.getItem('token')},}
      );
      setSelectedStudent('');
      alert('Student Removed successfully');
      await updateSelectedCourse();
    } catch (error) {
      console.error('Error removing student:', error.response ? error.response.data : error.message);
      setErrorMessages(prev => ({ ...prev, removeStudent: 'Failed to remove student' }));
    }
  };

  const handleConfirmRemoveAssignment = (asg) => {
    setAssignmentToRemove(asg);
    setOpenAssignmentDialog(true);
  };

  const handleRemoveAssignment = async () => {
    setOpenAssignmentDialog(false);

    try {
      const response = await axios.put(routes.removeAssignment,
          { fileLink: assignmentToRemove },
          { headers: { 'authorization': localStorage.getItem('token') }, }
      );
      if (response.status === 200) {
        alert('Assignment Removed successfully');
        await updateSelectedCourse()
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert(error.response.data);
      console.error('Error removing assignment:', error.response ? error.response.data : error.message);
      setErrorMessages(prev => ({ ...prev, removeAssignment: 'Failed to remove assignment' }));
    }
  };


  const handleFileUpload = (event) => {
    console.log(event.target.files)
    setAssignmentFile(Object.values(event.target.files));
  };

  const handleUploadAssignment = async () => {
    if (!assignmentFile || !expandedWeek) {
      alert('Please select a file to upload and ensure a week is expanded.');
      return;
    }

    const formData = new FormData();
    assignmentFile.map((file) => {
      formData.append('assignment', file);
    })

    formData.append('week', expandedWeek);
    formData.append('courseId', selectedCourse._id);

    try {
      const response = await axios.post(routes.uploadAssignment, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': localStorage.getItem('token')
        },
      });
      console.log(response.data)
      const updatedCourse = await axios.get(`${routes.getCourse}/${selectedCourse._id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': localStorage.getItem('token')
        },
      });
      setSelectedCourse(updatedCourse.data);
      setAssignmentFile([]);
      setErrorMessages(prev => ({ ...prev, [expandedWeek]: '' }));
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      setErrorMessages(prev => ({ ...prev, [expandedWeek]: 'Failed to upload file' }));
    }
  };

  const renderWeekDetail = (week) => (
      <Box sx={{ p: 2, border: '1px solid grey', mt: 2, borderRadius: 2 }}>

        <List>
          {
            assignments[expandedWeek].map((asg, key) =>
                <ListItem key={key}
                          secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={ () => handleConfirmRemoveAssignment(asg)}>
                              <DeleteIcon />
                            </IconButton>
                          }
                >
                  <ListItemText primary={`${asg}`} />
                </ListItem>
            )
          }
        </List>
        <List>
          {assignmentFile.map((file, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${file.name} - ${(file.size/100000).toFixed(2)}MB`} />
              </ListItem>
          ))}
        </List>

        <Button variant="contained" component="label" sx={{mr: 2}}>
          Upload File
          <input type="file" hidden multiple onChange={handleFileUpload}/>
        </Button>
        <Button variant="contained" color="primary" onClick={handleUploadAssignment}>
          Upload
        </Button>
        {errorMessages[week] && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errorMessages[week]}
            </Typography>
        )}
      </Box>
  );

  return (
      <Box sx={{ display: 'flex', padding: "40px", backgroundColor: '#f5f5f5',
        minHeight: '100vh', }}>
        <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '-24px',
            }}
        >
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              My Courses
            </Typography>
            <Avatar src="path_to_teacher_profile_pic.png" alt="Teacher Profile" />
          </Box>
          {!selectedCourse ? (
              <Grid container spacing={3}>
                {allCourses.map((course, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card onClick={() => setSelectedCourse(course)} sx={{ cursor: 'pointer', height: '100%' }}>
                        <CardActionArea sx={{ height: '100%' }}>
                          <CardMedia
                              component="img"
                              height="200"
                              image={`http://localhost:8002${course.coverImage}`}
                              alt={course.name}
                          />
                          <CardContent>
                            <Typography variant="h5" component="div">
                              {course.name}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Person sx={{ mr: 1 }} />
                                <Typography variant="body2">{course.students.length} students</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <School sx={{ mr: 1 }} />
                                <Typography variant="body2">{course.credits} credits</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Schedule sx={{ mr: 1 }} />
                                <Typography variant="body2">{course.duration} Weeks</Typography>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => {
                                navigate("/updateCourse", {state: course})}
                              }>
                                <EditIcon  sx={{ mr: 1 }} />
                                <Typography variant="body2">Edit</Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                ))}
              </Grid>
          ) : (
              <Box sx={{ width: '100%', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src="path_to_course_teacher_pic.png" alt="Mrs. Ben" sx={{ mr: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    {selectedCourse.name}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1 }} />
                    <Typography variant="body2">{selectedCourse.students.length} students</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <School sx={{ mr: 1 }} />
                    <Typography variant="body2">{selectedCourse.credits} credits</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Schedule sx={{ mr: 1 }} />
                    <Typography variant="body2">{selectedCourse.duration} Weeks</Typography>
                  </Box>
                </Box>
                <Tabs value={value} onChange={handleTabChange} sx={{ alignSelf: 'flex-start', mb: 3 }}>
                  <Tab label="Materials" />
                  <Tab label="Register Student" />
                </Tabs>
                <Box sx={{ width: '100%' }}>
                  {value === 0 && (
                      <Grid container spacing={2}>
                        {Array.from({ length: selectedCourse.duration }, (_, index) => index + 1).map((week) => (
                            <Grid item xs={12} key={week}>
                              <Button
                                  fullWidth
                                  variant="outlined"
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    textTransform: 'none',
                                  }}
                                  onClick={() => handleWeekClick(week)}
                              >
                                <Typography>{week}</Typography>
                                {expandedWeek === week ? <ExpandLess /> : <ExpandMore />}
                              </Button>
                              {expandedWeek === week && renderWeekDetail(week)}
                            </Grid>
                        ))}
                      </Grid>
                  )}
                  {value === 1 && (
                      <Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ border: '1px solid grey', borderRadius: 2, p: 2, height: '100%' }}>
                              <Typography variant="h6">Enrolled student list</Typography>
                              <List>
                                {enrolledStudents.map((student, index) => (
                                    <ListItem key={index}
                                              secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleConfirmRemoveStudent(student._id)}>
                                                  <DeleteIcon />
                                                </IconButton>
                                              }
                                    >
                                      <ListItemText primary={student.email} />
                                    </ListItem>
                                ))}
                              </List>
                              {errorMessages.removeStudent && (
                                  <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                                    {errorMessages.removeStudent}
                                  </Typography>
                              )}
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ border: '1px solid grey', borderRadius: 2, p: 2, height: '100%' }}>
                              <Typography variant="h6">Select student</Typography>
                              <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="student-select-label">Select Student</InputLabel>
                                <Select
                                    labelId="student-select-label"
                                    id="student-select"
                                    value={selectedStudent}
                                    label="Select Student"
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                >
                                  {newStudents.map((student) => (
                                      <MenuItem key={student._id} value={student._id}>
                                        {student.id}       {student.email}
                                      </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <Button variant="contained" color="primary" onClick={handleRegisterStudent} fullWidth>
                                Register
                              </Button>
                              {errorMessages.general && (
                                  <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                                    {errorMessages.general}
                                  </Typography>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                  )}
                </Box>
              </Box>
          )}
        </Box>



        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Student Removal"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to remove this student?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleRemoveStudent} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
            open={openAssignmentDialog}
            onClose={() => setOpenAssignmentDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Remove Assignment"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to remove this assignment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAssignmentDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleRemoveAssignment} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
};

export default MyCourses;
