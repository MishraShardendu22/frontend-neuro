import Layout from './Layout';
import Theme from './components/Theme';
import Fast from './components/Page/Fast';
import FileStack from '../Temp/FileStack';
import EditImages from '../Temp/EditImages';
import Login from './components/Page/Login';
import Landing from './components/Page/Landing';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Page/Register';
import NotFound from './components/Page/Not-Found';
import Guidelines from './components/Page/Guidlines';
import NewCase from './components/Page/Hospital/NewCase';
import HomePatient from './components/Page/Patient/Home';
import HomeHospital from './components/Page/Hospital/Home';
import ProfilePatient from './components/Page/Patient/Profile';
import ReportsPatient from './components/Page/Patient/Reports';
import HistoryHospital from './components/Page/Hospital/History';
import ProtectedPatient from './components/Routes/protected/patient.route';
import ProtectedHospital from './components/Routes/protected/hospital.route';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/patient/home"
          element={
            <ProtectedPatient>
              <HomePatient />
            </ProtectedPatient>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedPatient>
              <ProfilePatient />
            </ProtectedPatient>
          }
        />
        <Route
          path="/patient/history"
          element={
            <ProtectedPatient>
              <ReportsPatient />
            </ProtectedPatient>
          }
        />

        <Route
          path="/hospital/home"
          element={
            <ProtectedHospital>
              <HomeHospital />
            </ProtectedHospital>
          }
        />
        <Route
          path="/hospital/history"
          element={
            <ProtectedHospital>
              <HistoryHospital />
            </ProtectedHospital>
          }
        />
        <Route
          path="/hospital/cases"
          element={
            <ProtectedHospital>
              <NewCase />
            </ProtectedHospital>
          }
        />
        <Route
          path="/hospital/guidelines"
          element={
            <ProtectedHospital>
              <Guidelines />
            </ProtectedHospital>
          }
        />

        <Route path="/too-fast" element={<Fast />} />

        <Route path="/file-temp" element={<FileStack />} />
        <Route path="/image-temp" element={<EditImages />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Theme />
    </Layout>
  );
};

export default App;
