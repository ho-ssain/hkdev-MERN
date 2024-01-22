import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar/navBar.component";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route path="/signin" element={<h2>Sign-In</h2>} />
          <Route path="/signup" element={<h2>Sign-Up</h2>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
