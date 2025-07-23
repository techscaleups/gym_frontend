import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import router from './router/router.jsx';
import './App.css';
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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        toastClassName="text-center"
        bodyClassName="w-100 text-center"
      />
    </Router>
  );
};

export default App;
