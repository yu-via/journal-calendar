import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Dock from "./Dock";
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDateKey = (date) => date.toISOString().split("T")[0];

export default function Calendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [month, setMonth] = useState(today.getMonth()); 
  const [year, setYear] = useState(today.getFullYear());

  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem('journal_entries');
    return savedEntries ? JSON.parse(savedEntries) : {};
  });
  
  


  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }, [entries]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const generateDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= lastDate; day++) {
      days.push(day);
    }
    return days;
  };

  const days = generateDays(year, month);
  const setToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };
  const handleDateClick = (day) => {
    const dateKey = formatDateKey(new Date(year, month, day));
    setSelectedDate(dateKey);
    setIsModalOpen(true);
  };
  const handleNewEntry = () => {
    const todayKey = formatDateKey(today);
    setSelectedDate(todayKey);
    setIsModalOpen(true);
  };
  const handleNavigate = (direction) => {
    const currentDate = new Date(selectedDate + 'T00:00:00');

    currentDate.setDate(currentDate.getDate() + direction);
    
    const newDateKey = formatDateKey(currentDate);
    setSelectedDate(newDateKey);
    setIsModalOpen(true);
  }
  const handleSaveEntry = (text) => {
    if (text) {
      setEntries((prevEntries) => ({
        ...prevEntries,
        [selectedDate]: text,
      }));
    } else {
      setEntries((prevEntries) => {
        const newEntries = { ...prevEntries };
        delete newEntries[selectedDate];
        return newEntries;
      });
    }
  };


  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 p-6 rounded-2xl shadow-xl max-w-3xl mx-auto my-10 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <select
            className="bg-white text-lg font-medium py-2 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer hover:bg-blue-50"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <button
            className="bg-white text-lg font-medium py-2 px-4 rounded-xl shadow-md appearance-none cursor-pointer hover:bg-blue-50 cursor-pointer"
            onClick={setToday}
          >
            Today
          </button>
          <button
            className="bg-gradient-to-l from-purple-400 to-indigo-500 text-lg text-white font-medium py-2 px-4 rounded-xl shadow-md appearance-none cursor-pointer hover:bg-gradient-to-r from-purple-400 to-indigo-500"
            onClick={handleNewEntry}
          >
            Journal
          </button>
        </div>
        <div className="flex items-center space-x-3 text-gray-700">
          <button
            className="text-2xl hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setYear(year - 1)}
          >
            ❮
          </button>
          <span className="font-bold text-3xl text-blue-700">{year}</span>
          <button
            className="text-2xl hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setYear(year + 1)}
          >
            ❯
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div className="text-center font-semibold text-gray-700 text-sm py-2" key={day}>
            {day}
          </div>
        ))}

        {days.map((date, i) => {
            const dateKey = date ? formatDateKey(new Date(year, month, date)) : null;
            const hasEntry = dateKey && entries[dateKey];
            const isToday = dateKey === formatDateKey(today);

            return (
            <div
                key={i}
                className={`relative p-2 h-24 flex flex-col justify-between items-start rounded-lg transition-all duration-200 group
                            ${date ? 'bg-white shadow-sm hover:bg-blue-50 cursor-pointer' : 'bg-gray-100 opacity-60 pointer-events-none'}
                            ${isToday ? 'border-2 border-blue-500 bg-blue-100' : ''}
                            `}
            >
                <span className="font-bold text-xl text-gray-800">
                {date ? date : ""}
                </span>

                {hasEntry && (
                    <button 
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-1.5 bg-green-400 rounded-full" title={entries[dateKey]}
                    ></button>
                )}

                {date && (
                <button className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => handleDateClick(date)}>
                    +
                </button>
                )}
            </div>
            );
        })}
      </div>
      <div>
           <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEntry}
            date={selectedDate}
            initialText={selectedDate ? entries[selectedDate] || "" : ""}
            onNavigate={handleNavigate}
          />
       </div>
      
    </div>
    
  );
}