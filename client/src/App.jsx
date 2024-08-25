import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import CaruselItems from "./pages/CaruselItems";
import RecentNotices from "./pages/RecentNotices";
import Teachers from "./pages/Teachers";
import NotFound from "./pages/NotFound";
import EditNotice from "./pages/EditNotice";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import AddNewNotice from "./pages/AddNewNotice";
import EditNews from "./pages/EditNews";
import AddNewNews from "./pages/AddNewNews";
import EditCarousel from "./pages/EditCarousel";
import AddNewCarousel from "./pages/AddNewCarousel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/gallery" element={<Gallery />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/news" element={<News />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/carusel" element={<CaruselItems />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/recentnotices" element={<RecentNotices />} />
        </Route>
       
        <Route element={<PrivateRoute />}>
          <Route path="/recentnotices/:noticeId" element={<EditNotice />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/news/:newsId" element={<EditNews />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/carusel/:carouselId" element={<EditCarousel />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/recentnotices/createnotice" element={<AddNewNotice />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/news/createnews" element={<AddNewNews />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/carusel/createcarousel" element={<AddNewCarousel />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/teachers" element={<Teachers />} />
        </Route>

        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
