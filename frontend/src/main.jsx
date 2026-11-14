import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Browser entry point: attach the React tree to #root and enable development checks.
// බ්‍රවුසර පිවිසුම් ස්ථානය: React ගස #root වෙත සම්බන්ධ කර සංවර්ධන පරීක්ෂා සක්‍රීය කරයි.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
