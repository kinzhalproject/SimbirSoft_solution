import React, { useRef } from 'react';
import './DateInput.css';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    inputRef.current?.showPicker?.();
  };

  return (
    <div className="date-input-wrap">
      <input
        ref={inputRef}
        type="date"
        className="date-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <img
        src="/calendarIcon.png"
        alt="calendar"
        className="calendar-icon"
        onClick={handleIconClick}
      />
    </div>
  );
};

export default DateInput;
