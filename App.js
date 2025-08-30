import React from 'react';
import Calendar from './Calendar';
import Dock from './Dock';
//import './App.css';

export default function App(){
  return (
    <div className="app-container">
      

      <div className="calendar-wrapper">
        <Calendar/>
      </div>

    </div>
  );
}