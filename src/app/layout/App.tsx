import React, { useEffect, useContext } from 'react';
import './App.css';
import MassMailer from '../../features/mass-mailer/MassMailer';
import { Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from '../../features/login/LoginPage';
import Home from '../../features/home/Home';
import NotFoundPage from '../../features/exception-pages/NotFoundPage';
import UserInfoContext from '../../stores/userInfo';
import PrivateRoute from '../../sharedComponents/PrivateRoute';
import MasterSearch from '../../features/master-search/MasterSearch';
import DropShip from '../../features/dropship/DropShip';
import UserListPage from '../../features/user-list/UserListPage';
import setDocumentTitle from '../../utils/setDocumentTitle';

const App: React.FC = () => {
  const userInfo = useContext(UserInfoContext);
  const location = useLocation();

  useEffect(() => {
    setDocumentTitle(location.pathname); // Update the title based on the current pathname

    const u = localStorage.getItem('username');
    if (u !== null) userInfo.setUserName(u);
    const p = localStorage.getItem('password');
    if (p !== null) userInfo.setPassWord(p);
  }, [location.pathname, userInfo]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/dropship" element={<DropShip />} />
        <Route path="/massmailer" element={<MassMailer />} />
        <Route path="/mastersearch" element={<MasterSearch />} />
        <Route path="/userlist" element={<UserListPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
