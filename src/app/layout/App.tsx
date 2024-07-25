import React, { useEffect, useContext } from 'react';
import './App.css';
import MassMailer from '../../pages/mass-mailer/MassMailer';
import { Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from '../../pages/login/LoginPage';
import Home from '../../pages/home/Home';
import NotFound from '../../pages/exception-pages/NotFound'
import UserInfoContext from '../../stores/userInfo';
import PrivateRoute from '../../components/PrivateRoute';
import MasterSearch from '../../pages/master-search/MasterSearch';
import OpenSalesOrderReport from '../../pages/open-so-report/OpenSalesOrderReport'
import DropShip from '../../pages/dropship/DropShip';
import UserListPage from '../../pages/user-list/UserListPage';
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
        <Route path="/opensalesorderreport" element={<OpenSalesOrderReport />} />
        <Route path="/userlist" element={<UserListPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
