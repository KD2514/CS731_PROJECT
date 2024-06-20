import React from 'react';
import {Card, CardContent, CardMedia, Typography, Box, Avatar, CardActionArea, Grid} from '@mui/material';
import {Star, School, AccessTime, Person, Schedule} from '@mui/icons-material';

const CourseCard = ({ course, setSelectedCourse }) => {
  return (
      <Grid item xs={12} sm={6} md={4} key={course._id}>
        <Card onClick={() => setSelectedCourse(course)} sx={{ cursor: 'pointer', height: '100%' }}>
          <CardActionArea sx={{ height: '100%' }}>
            <CardMedia
                component="img"
                height="140"
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
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
  );
};

export default CourseCard;
