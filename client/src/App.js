import "./App.css";
import Wrapper from "./pages/Wrapper";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./ProtectRouter/PrivateRoute";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import  Search  from "./pages/Search";

function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <Routes>
        {/* Private Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Wrapper />
            </PrivateRoute>
          }
        >
          <Route index element={<Feed />} />
          <Route path="profile" element={<Profile />} />
          <Route path="search" element={<Search />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
