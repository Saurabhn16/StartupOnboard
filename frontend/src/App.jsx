import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Blogs from "./pages/blogs/Blogs";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import ProfileUpdate from "./pages/profile/ProfileUpdate";
import Navbar from "./components/navbar/navbar";
import UserBlogs from "./pages/userBLogs/userBlog";
import SearchUpdate from "./pages/search/search";
import UserProfile from "./pages/userProfile/userProfile";

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className=" container">

        <Navbar />
      
      <div className="main-content flex">
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <SignUp />}
          />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/profile" element={<ProfileUpdate />} />
          <Route path="/userBlogs" element={<UserBlogs />} />  
           <Route path="/search" element={<SearchUpdate />} />
           <Route path="/profile/:id" element={<UserProfile/>} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
