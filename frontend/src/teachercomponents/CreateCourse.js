import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation, useNavigate, useNavigation} from 'react-router-dom';
import { TextField, Button, Grid, Typography, Box, Snackbar, Alert } from '@mui/material';
import TeacherSidebar from './TeacherSidebar';
import routes from "../helpers/routes";

const CreateCourse = ({ addCourse }) => {
    const location = useLocation();
    const [courseName, setCourseName] = useState('');
    const [courseID, setCourseID] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseDuration, setCourseDuration] = useState('');
    const [courseCredits, setCourseCredits] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


    useEffect(() => {
        console.log(location)
        if (location.state && location.state?.courseID) {
            // If courseID is passed in location.state, fetch the course details
            const courseID = location.state?.courseID;
            setCourseID(courseID);

            fetchCourseDetails(courseID);
        }
    }, [location.state]);

    const fetchCourseDetails = async (courseID) => {
        try {
            const response = await axios.get(routes.getCourse + "/" + location.state._id, {
                headers: {
                    'authorization': localStorage.getItem('token')
                },
            });
            const course = response.data;
            setCourseName(course.name);
            setCourseDescription(course.description);
            setCourseDuration(course.duration);
            setCourseCredits(course.credits);
            setCoverImageUrl("http://localhost:8002"+course.coverImage);
        } catch (error) {
            console.error('There was an error fetching the course details!', error);
        }
    };

    const handleCreateCourse = async () => {
        const formData = new FormData();
        formData.append('name', courseName);
        formData.append('courseID', courseID);
        formData.append('description', courseDescription);
        formData.append('duration', courseDuration);
        formData.append('credits', courseCredits);
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

        try {
            const response = await axios.post(routes.createCourse, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': localStorage.getItem('token')
                },
            });
            addCourse(response.data);
            resetForm();
            setSnackbar({ open: true, message: 'Course created successfully!', severity: 'success' });
            navigate("/teacher/mycourses")
        } catch (error) {
            console.error('There was an error creating the course!', error);
            setSnackbar({ open: true, message: 'Failed to create course!', severity: 'error' });
        }
    };


    const navigate = useNavigate()
    const handleUpdateCourse = async () => {
        const formData = new FormData();
        formData.append('name', courseName);
        formData.append('description', courseDescription);
        formData.append('duration', courseDuration);
        formData.append('credits', courseCredits);
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

        try {
            await axios.put(routes.updateCourse + courseID, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': localStorage.getItem('token')
                },
            });
            setSnackbar({ open: true, message: 'Course updated successfully!', severity: 'success' });
            navigate("/teacher/mycourses")
        } catch (error) {
            console.error('There was an error updating the course!', error);
            setSnackbar({ open: true, message: 'Failed to update course!', severity: 'error' });
        }
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        setCoverImage(file);
        if (file) {
            setCoverImageUrl(URL.createObjectURL(file));
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const resetForm = () => {
        setCourseName('');
        setCourseDescription('');
        setCourseDuration('');
        setCourseCredits('');
        setCoverImage(null);
        setCoverImageUrl('');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <TeacherSidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh',
                }}
            >
                <Typography variant="h4" gutterBottom align="left" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
                    {location.state?.courseID ? 'Edit Course' : 'Create Course'}
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Course Name"
                                        variant="outlined"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Course ID"
                                        variant="outlined"
                                        value={courseID}
                                        onChange={(e) => setCourseID(e.target.value)}
                                        disabled={!!location.state?.courseID} // Disable editing if courseID is set
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Course Description"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        value={courseDescription}
                                        onChange={(e) => setCourseDescription(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        type={"number"}
                                        fullWidth
                                        InputProps={{
                                            inputProps: { min: 0 }
                                        }}
                                        label="Course Duration (in weeks)"
                                        variant="outlined"
                                        value={courseDuration}
                                        onChange={(event) => {
                                            event.target.value < 0
                                                ? setCourseDuration(0)
                                                : setCourseDuration(event.target.value)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        type={"number"}
                                        fullWidth
                                        InputProps={{
                                            inputProps: { min: 0 }
                                        }}
                                        label="Course Credits"
                                        variant="outlined"
                                        value={courseCredits}
                                        onChange={(event) => {
                                            event.target.value < 0
                                                ? setCourseCredits(0)
                                                : setCourseCredits(event.target.value)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box
                            sx={{
                                border: '2px dashed #1976d2',
                                borderRadius: 2,
                                padding: 2,
                                textAlign: 'center',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#e3f2fd',
                                ...(coverImageUrl && {
                                    backgroundImage: `url(${coverImageUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }),
                            }}
                        >
                            <Typography variant="body1" sx={{ mb: 2, color: '#1976d2' }}>Course Cover Image</Typography>
                            <Button variant="contained" component="label" sx={{ color: 'white', backgroundColor: '#1976d2' }}>
                                {location.state?.courseID ? "Change Image" : "Upload"}
                                <input type="file" hidden onChange={handleCoverImageChange} />
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    {location.state?.courseID ? (
                        <>
                            <Button variant="contained" color="primary" onClick={handleUpdateCourse} sx={{ px: 5, py: 1.5, fontSize: '1rem', mr: 2 }}>
                                Save
                            </Button>
                            <Button variant="outlined" color="info" onClick={resetForm} sx={{ px: 5, py: 1.5, fontSize: '1rem', mr: 2 }}>
                                Reset
                            </Button>
                            <Button variant="contained" color="error" onClick={() => {navigate('/teacher/mycourses')}} sx={{ px: 5, py: 1.5, fontSize: '1rem' }}>
                                Exit
                            </Button>
                        </>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleCreateCourse} sx={{ px: 5, py: 1.5, fontSize: '1rem' }}>
                            Create
                        </Button>
                    )}
                </Box>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default CreateCourse;
