// About.js
import React from 'react';
import './About.css';
// import ayushImage from '../assets/ayush.png';
// import sakshamImage from '../assets/saksham.png';
// import prajjwalImage from '../assets/prajjwal.png';

const About = () => {
    const ayushImage = require('../assets/ayush.png');
const sakshamImage = require('../assets/saksham.png');
const prajjwalImage = require('../assets/prajjwal.png');

  const teamMembers = [
    { id: 1, name: 'Ayush Yadav', image: ayushImage , intro: 'we will ' },
    { id: 2, name: 'Saksham Tiwari', image: sakshamImage , intro: 'add our intro' },
    { id: 3, name: 'Prajjwal Singh', image: prajjwalImage , intro: 'Soon' },
  ];

  return (
    <div className="about-container">
      <h2 className="about-title">Meet the Team</h2>
      <div className="card-container">
        {teamMembers.map(member => (
          <div key={member.id} className="profile-card">
            <div className="image-container">
              <img src={member.image} alt={member.name} className="profile-image" />
            </div>
            <h3 className="profile-name">{member.name}</h3>
            <p className="profile-intro">{member.intro}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
