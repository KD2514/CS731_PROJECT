import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Grid, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CourseCard from './CourseCard';
import  {useNavigate}  from 'react-router-dom';
import routes from "../helpers/routes";

const CourseList = ({ onCourseSelect }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
          const userData = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(routes.getCourse );
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };
      fetchCourses();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleCourseClick = (course) => {
    navigate(`/course/${course._id}`);
  };

  const filteredCourses = courses.filter((course) =>
    (course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5',
      minHeight: '100vh', }}>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          placeholder="Search Course Name/Mentor"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderRadius: '25px',
                },
              },
            },
          }}
        />
      </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
            {filteredCourses.map(course => (
                <Box key={course._id} sx={{ marginBottom: '32px' }} >
                    <CourseCard course={course} setSelectedCourse={(course) => {navigate("/student/viewCourse", {state: course})}} />
                </Box>
            ))}
        </Box>

    </Box>
  );
};

export default CourseList;
