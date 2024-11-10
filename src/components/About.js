import React from 'react';

// Importing images
const ayushImage = require('../assets/ayush.png');
const sakshamImage = require('../assets/saksham.png');
const prajjwalImage = require('../assets/prajjwal.png');

const About = () => {
  const teamMembers = [
    { id: 1, name: 'Ayush Yadav', image: ayushImage, intro: 'We will help you achieve your academic goals!' },
    { id: 2, name: 'Saksham Tiwari', image: sakshamImage, intro: 'We strive to bring innovation and clarity!' },
    { id: 3, name: 'Prajjwal Singh', image: prajjwalImage, intro: 'Soon, we will help you reach new heights!' },
  ];

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-semibold text-center mb-8">Meet the Team</h2>
      
      {/* Motivational Description */}
      <div className="mb-8 text-lg text-center max-w-3xl mx-auto">
        <p>
          We created this platform to make learning more accessible, fun, and effective for students. Our mission is to
          inspire and motivate students to reach their full potential by providing tools to manage their studies, track
          progress, and stay on top of assignments. Together, we aim to create a space where students can thrive and grow.
        </p>
      </div>
      
      {/* Team Members Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map(member => (
          <div key={member.id} className="bg-gray-800 rounded-xl shadow-lg p-6 text-center transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-gray-600 hover:translate-y-2">
            <div className="w-32 h-32 mx-auto mb-4 transition-all transform hover:scale-110">
              <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <h3 className="text-2xl font-semibold text-teal-400 mb-2">{member.name}</h3>
            <p className="text-lg text-gray-400">{member.intro}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
