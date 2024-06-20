const homeRoute = "http://localhost:8002/api"
const routes = {
    register: homeRoute + "/users/register",
    login: homeRoute + "/users/login",
    getStudents: homeRoute + "/users/students",
    getCourse: homeRoute + "/courses",
    uploadAssignment: homeRoute + "/courses/upload",
    removeAssignment: homeRoute + "/courses/remove-assignment",
    getAssignment: homeRoute + "/courses/getAssignment",
    createCourse: homeRoute + "/courses/create-course",
    updateCourse: homeRoute + "/courses/edit/",
    registerUser: homeRoute + "/courses/add-student",
    removeUser: homeRoute + "/courses/remove-student",
}
export default routes