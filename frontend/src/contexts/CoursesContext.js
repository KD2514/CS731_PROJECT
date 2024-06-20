import React, { createContext, useState, useContext } from 'react';

const CoursesContext = createContext();

export const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState([
    {
      name: 'Machine Learning',
      teacher: 'Mrs. Ben',
      students: 50,
      duration: '3 Months',
      credits: 3,
    },
  ]);

  const addCourse = (course) => {
    setCourses([...courses, course]);
  };

  return (
    <CoursesContext.Provider value={{ courses, addCourse }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => useContext(CoursesContext);
