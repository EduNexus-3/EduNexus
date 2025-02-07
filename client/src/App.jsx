// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { LogIn } from "./pages/LogIn";
import { SignUp } from "./pages/SignUp";

function App() {
  return (
    <Router>
      <AppContainer>
        {/* <h1>EduNexus</h1> */}
        <Routes>
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
`;
