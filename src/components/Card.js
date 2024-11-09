import React from 'react';
import './Card.css' ;
const Card = ({ title, onClick }) => {
  return (
    <div
      onClick={onClick}  >
      <div className="ag-courses-item_link">
        <div className="ag-courses-item_bg"></div>
        <h3 className="ag-courses-item_title">{title}</h3>
        <div className="ag-courses-item_date-box">
        
        </div>
      </div>
    </div>
  );
};

export default Card;
