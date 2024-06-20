

// _____________________________________________________________________________________________________________________________________
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem,
  IconButton,
  ListItemText,
  FormControl, InputLabel, Select, MenuItem, Button, TextField, Card
} from '@mui/material';
import axios from 'axios';
import CourseCard from './CourseCard';
import routes from "../helpers/routes";
import {CreditCard, ExpandLess, ExpandMore, Person, Schedule, School} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useLocation} from "react-router-dom";
import {io} from "socket.io-client"; // Import the CourseCard component
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const socket = io('http://localhost:8002')

const MyCourse = () => {
  const [user, setUser] = useState(null); // Initialize user state with null
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatView, setChatView] = useState(false);

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        // Retrieve user data from local storage
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        // Get the user's authentication token from the stored user data
        // const token = userData.token;
        // if (!token) {
        //   console.error('Authentication token not found in user data:', userData);
        //   return; // Exit the function if token is not found
        // }
        //
        // // Make a request to get the logged-in user's data
        // const userDataResponse = await axios.get('http://localhost:8002/api/user', {
        //   headers: {
        //     Authorization: token // Include the token in the request header
        //   }
        // });

        // const userEmail = userDataResponse.data.email;
        // Make a request to fetch user courses based on their email
        const coursesResponse = await axios.get(routes.getCourse+"?studentId="+userData._id, );

        // Update state with user and courses data
        // setUser(userDataResponse.data);
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  
  const handleLogout = () => {
    console.log('User logged out');
  };


  const handleWeekClick = (week) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

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

  const renderWeekDetail = (week) => (
      <Box sx={{ p: 2, border: '1px solid grey', mt: 2, borderRadius: 2 }}>
        {
          assignments[expandedWeek].map((asg, key) =>
            <List>
              <ListItem key={key}>
                <a target="_blank" href={`http://localhost:8002${asg}`}> Download - ..${asg} </a>
              </ListItem>
            </List>
          )
        }

      </Box>
  );


  useEffect(() => {
    if(selectedCourse) {
      socket.emit('joinCourse', selectedCourse.courseID);
      socket.on('receiveMessage', (message) => {
        if (Array.isArray(message)) {
          setMessages((prevMessages) => [...prevMessages, ...message]);
        } else if (message) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [selectedCourse]);

  useEffect(() => {
    console.log(messages)
  }, [messages]);



  const handleSendMessage = () => {
    if(!message) {
      return
    }
    const messageData = {
      courseId: selectedCourse.courseID,
      message: { user: user.id, text: message }
    };
    socket.emit('sendMessage', messageData);
    setMessage('');
  };

  if (!user) {
    // Render loading state while user data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5',
        minHeight: '100vh', }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#3f51b5', flexGrow: 1 }}>
            My Courses
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: { xs: 2, md: 0 } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5', marginRight: 2 }}>{user.name}</Typography>
            <Avatar alt={user.name} src={user.avatar} sx={{ width: 48, height: 48 }} />
          </Box>
        </Box>

        {!selectedCourse ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
            {courses.map(course => (
              <Box key={course._id} sx={{ marginBottom: '32px' }}>
                <CourseCard course={course} setSelectedCourse={setSelectedCourse} />
              </Box>
            ))}
          </Box>
        ): (
            <Box sx={{ width: '100%', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src="path_to_course_teacher_pic.png" alt="Mrs. Ben" sx={{ mr: 2 }} />
                <Typography variant="h5" gutterBottom>
                  {selectedCourse.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ mr: 3 }}>{selectedCourse?.students?.length} students</Typography>
                <School sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ mr: 3 }}>{selectedCourse?.credits} credits</Typography>
                <Schedule sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ mr: 3 }}>{selectedCourse?.duration} Weeks</Typography>
              </Box>

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
                        <Typography>{week} week</Typography>
                        {expandedWeek === week ? <ExpandLess /> : <ExpandMore />}
                      </Button>
                      {expandedWeek === week && renderWeekDetail(week)}
                    </Grid>
                ))}
              </Grid>
            </Box>

        ) }
      </Box>
      <div>
      {(selectedCourse && chatView) && (<Card sx={{ marginLeft: "5%", width: '30%', position: "absolute", right: "0", bottom: "0", height: "70vh" }}>
        <Box sx={{ height: "6vh", background: "#f5f5f5" }}>
        </Box>
        <Box sx={{ padding: 2 }}>
          <List sx={{

            height: "58vh",
            overflow: "scroll",
            overflowX: "hidden"
          }}
          className={"scroll"}>
            {messages.map((msg, index) => (
                <ListItem
                    key={index}
                    sx={{
                      flexDirection: msg.user === user.id ? 'row-reverse' : 'row',
                    }}
                >
                  <div style={{
                    display: "inline-block",
                    padding: "1vw",
                    background:  "#1976d2",
                    color: "white",
                    borderRadius: "1vw"
                  }}>
                    {`${msg.user === user.id ? 'YOU' : msg.user}: ${msg.text}`}
                  </div>
                </ListItem>
            ))}
          </List>
          <div style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            bottom: '1vh',
            zIndex: 10,
            width: '94%'
          }}>
            <TextField
                fullWidth
                variant="outlined"
                label="Message"
                value={message}
                sx={{ bgcolor: "white"}}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                sx={{ height: '6vh' }}
            >
              <SendIcon/>
            </Button>
          </div>

        </Box>
      </Card>)}
      {(selectedCourse) && <Card sx={{
        marginLeft: "5%", position: "absolute", right: "1vw",
        bottom: !chatView ? '0' : '65vh' , background: "#f5f5f5"
      }}>
        <Button
            variant="contained"
            color="primary"
            onClick={() => setChatView(!chatView)}
            sx={{ mt: 1 }}
        >
          {!chatView ? (<><ExpandLessIcon/> View Chat</>) : (<><ExpandMoreIcon/> Hide Chat</>)}
        </Button>
      </Card>}
      </div>
    </Box>
  );
};

export default MyCourse;
