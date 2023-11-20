import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import BookmarkForm from "./features/bookmarks/BookmarkForm";
import UserSettings from "./features/users/UserSettings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Public />} />
          <Route path="login" element={<Login />} />
          <Route path="dash/*" element={<DashLayout />}>
            <Route index element={<Welcome />} />

            <Route path="bookmark">
              <Route index element={<BookmarkForm />} />
            </Route>

            <Route path="users">
              <Route index element={<UserSettings />} />
            </Route>
          </Route>
          {/* //Login ends */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
