import React from 'react';
import './DateSelector.css';

export default function DateSelector({ dates, selectedDate, onSelectDate }) {
  const isSelected = (date) => date.toDateString() === selectedDate.toDateString();
  const isToday = (date) => date.toDateString() === new Date().toDateString();

  return (
    <div className="date-selector">
      <span className="date-selector-label">Select Date:</span>
      <div className="date-buttons">
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            className={`date-button${isSelected(date) ? ' selected' : ''}`}
            onClick={() => onSelectDate(date)}
          >
            <div>{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
            <div>{date.getDate()}/{date.getMonth() + 1}</div>
            {isToday(date) && <div className="today-label">Today</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
