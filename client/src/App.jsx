import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import AuthContext from "./store/auth-context";
import jwtDecode from "jwt-decode";

function App() {
  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserdata(decoded);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUserdata(null);
  };

  return (
    <AuthContext.Provider value={{ userdata, setUserdata, logout }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
