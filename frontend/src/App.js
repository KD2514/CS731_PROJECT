import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import CreateCourse from './teachercomponents/CreateCourse';
import TeacherMyCourses from './teachercomponents/MyCourses'; // Renamed to avoid conflict
import StudentMyCourses from './components/MyCourse'; // Renamed to avoid conflict
import CourseCard from './components/CourseCard';
import CourseList from './components/CourseList';
import LoginForm from './components/LoginForm';
import Logo from './components/Logo';
import RegistrationForm from './components/RegistrationForm';
import Sidebar from './components/Sidebar'; // Student Sidebar
import Topbar from './components/Topbar';
import TeacherSidebar from './teachercomponents/TeacherSidebar';
import routes from "./helpers/routes";
import ViewCourse from "./components/ViewCourse"; // Teacher Sidebar

const App = () => {
  const [courses, setCourses] = useState([]);

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     try {
  //       const response = await axios.get(routes.getCourse);
  //       setCourses(response.data);
  //     } catch (error) {
  //       console.error('Failed to fetch courses', error);
  //     }
  //   };
  //   fetchCourses();
  // }, []);

  const addCourse = (course) => {
    setCourses([...courses, course]);
  };

  return (
    <Router>
      <MainContent courses={courses} addCourse={addCourse} />
    </Router>
  );
};

const MainContent = ({ courses, addCourse }) => {
  const location = useLocation();
  const hideSidebarAndTopbar = location.pathname === '/' || location.pathname === '/register';
  const hideTopbar = hideSidebarAndTopbar || location.pathname === '/student/mycourses' || location.pathname === '/teacher/mycourses' || location.pathname === '/student/viewCourse';

  return (
    <div style={{ display: 'flex' }}>
      {!hideSidebarAndTopbar && location.pathname.startsWith('/student') && <Sidebar />}
      {!hideSidebarAndTopbar && location.pathname.startsWith('/teacher') && <TeacherSidebar />}
      <div style={{ flexGrow: 1 }}>
        {!hideTopbar && <Topbar />}
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/student/viewCourse" element={<ViewCourse />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/createcourse" element={<CreateCourse addCourse={addCourse} />} />
          <Route path="/updateCourse" element={<CreateCourse addCourse={addCourse} />} />
          <Route path="/coursecard" element={<CourseCard />} />
          <Route path="/courselist" element={<CourseList />} />
          <Route path="/student/mycourses" element={<StudentMyCourses courses={courses} />} />
          <Route path="/student/explorecourses" element={<CourseList />} />
          <Route path="/teacher/mycourses" element={<TeacherMyCourses courses={courses} />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logo" element={<Logo />} />
          <Route path='/course/:courseId' element={<CourseCard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
