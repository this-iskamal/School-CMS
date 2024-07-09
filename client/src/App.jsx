import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import CaruselItems from "./pages/CaruselItems";
import RecentNotices from "./pages/RecentNotices";
import Teachers from "./pages/Teachers";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news" element={<News />} />
        <Route path="/carusel" element={<CaruselItems />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/recentnotices" element={<RecentNotices />} />
        <Route path="/teachers" element={<Teachers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
