import React, { useEffect, useContext } from 'react';
import './App.css';
import MassMailer from '../../features/mass-mailer/MassMailer';
import { Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from '../../features/login/LoginPage';
import Home from '../../features/home/Home';
import NotFoundPage from '../../features/exception-pages/NotFoundPage';
import UserInfo from '../../stores/userInfo';
import PrivateRoute from '../../sharedComponents/PrivateRoute';
import TimeTrackerPage from '../../features/time-tracker/TimeTrackerPage';
import MasterSearch from '../../features/master-search/MasterSearch';
import DropShip from '../../features/dropship/DropShip';
import UserListPage from '../../features/user-list/UserListPage';
import setDocumentTitle from '../../utils/setDocumentTitle'; // Import the utility function

const App: React.FC = () => {
  const { setUserName, setPassWord } = useContext(UserInfo);
  const location = useLocation();

  useEffect(() => {
    setDocumentTitle(location.pathname); // Update the title based on the current pathname

    const u = localStorage.getItem('username');
    if (u !== null) setUserName(u);
    const p = localStorage.getItem('password');
    if (p !== null) setPassWord(p);
  }, [location.pathname, setUserName, setPassWord]); // Add location.pathname as a dependency

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/DropShip" element={<DropShip />} />
        <Route path="/MassMailer" element={<MassMailer />} />
        {/* <Route path="/TimeTracker" element={<TimeTrackerPage />} /> */}
        <Route path="/MasterSearch" element={<MasterSearch />} />
        <Route path="/UserList" element={<UserListPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
