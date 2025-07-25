import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import router from './router/router.jsx';
import './App.css';
import "./styles/mobile.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const staging = '/';


const App = () => {
  return (
    <Router basename={staging}>
      <Routes>
        {router.map((route) => {
          const Component = route.element;
          return (
            <Route
              key={route.name}
              path={route.path}
              element={<Component />}
            />
          );
        })}
      </Routes>
      <ToastContainer   autoClose={2000} />
    </Router>
  );
};

export default App;
