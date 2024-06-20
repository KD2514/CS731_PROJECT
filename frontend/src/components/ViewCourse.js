import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { io } from 'socket.io-client';
import routes from "../helpers/routes";
import {Person, Schedule, School} from "@mui/icons-material";

const ViewCourse = () => {
  const [user, setUser] = useState('');
  const [courseID, setCourseID] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    setUser(userData);
  }, []);

  useEffect(() => {
    if (location.state && location.state?.courseID) {
      setCourseID(location.state?.courseID);
      fetchCourseDetails(location.state?.courseID);

    }
  }, [location.state]);


  const fetchCourseDetails = async (courseID) => {
    try {
      const response = await axios.get(`${routes.getCourse}/${location.state._id}`, {
        headers: {
          'authorization': localStorage.getItem('token')
        },
      });
      const course = response.data;
      setSelectedCourse(course);
    } catch (error) {
      console.error('There was an error fetching the course details!', error);
    }
  };

  if (!selectedCourse) {
    return null;
  }

  return (
      <Box sx={{ display: 'flex', backgroundColor: '#f5f5f5',
        minHeight: '100vh', }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#3f51b5', flexGrow: 1 }}>
              Course Overview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: { xs: 2, md: 0 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5', marginRight: 2 }}>{user.name}</Typography>
              <Avatar alt={user.name} src={user.avatar} sx={{ width: 48, height: 48 }} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap' }}>
            {selectedCourse ? (
                <Card sx={{ marginLeft: "5%", width: '60%' }}>
                  <CardMedia
                      component="img"
                      alt="Course Cover"
                      height="340"
                      image={`http://localhost:8002${selectedCourse.coverImage}`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ mb: 3 }}>
                      {selectedCourse.name}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 2, display: 'flex', alignItems: 'left', justifyContent: 'flex-start', gap: 1, color: 'grey' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "3vw" }}>
                        <Avatar alt={user.name} src={user.avatar} sx={{ width: 22, height: 22 }} />
                        <Typography variant="body2">{selectedCourse.teacherId}</Typography>
                      </Box> |
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2">{selectedCourse.name}</Typography>
                      </Box> |

                    </Box>
                    <Box sx={{ mt: 1, mb: 2, display: 'flex', alignItems: 'left', justifyContent: 'flex-start', gap: '1vw' }}>
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
                    <hr style={{ color: "gray" }} />
                    <Typography variant="body2" color="text.secondary">
                      <Typography gutterBottom variant="h5" component="div" sx={{ mb: 3 }}>
                        Description
                      </Typography>
                      {selectedCourse.description}
                    </Typography>
                  </CardContent>
                </Card>
            ) : ""}

            <Card sx={{ marginLeft: "5%", width: '30%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: "column" }}>
                <Avatar sx={{ mb: 2, width: 124, height: 124 }} src="path/to/user.jpg" />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>{selectedCourse.teacherId}</Typography>
              </Box>

            </Card>
          </Box>
        </Box>
      </Box>
  );
};

export default ViewCourse;
