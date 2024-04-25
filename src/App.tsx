import { Route, Routes } from "react-router-dom";
import { Editor, Home } from "./pages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="new" element={<Editor />} />
        <Route path="edit/:id" element={<Editor />} />
      </Routes>
    </div>
  );
}

export default App;
