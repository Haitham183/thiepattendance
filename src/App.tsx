/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n/config';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Evaluations from './pages/Evaluations';
import Trainees from './pages/Trainees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Specializations from './pages/Specializations';
import Groups from './pages/Groups';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/specializations" element={<Specializations />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/trainees" element={<Trainees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
