import React from 'react';
import { Award, Trophy, Star, Medal } from 'lucide-react';

const Winners = () => {
  // Sample winners data - you can replace this with actual data from your backend
  const winners = [
    {
      id: 1,
      name: "Student Award Winner",
      achievement: "Best Pronunciation - Śravaṇaṃ",
      year: "2024",
      description: "Exceptional mastery in Sanskrit pronunciation and recitation"
    },
    {
      id: 2,
      name: "Outstanding Student", 
      achievement: "Outstanding Progress - Kirtanam",
      year: "2024",
      description: "Remarkable improvement and dedication to learning"
    },
    {
      id: 3,
      name: "Consistent Learner",
      achievement: "Most Consistent Student",
      year: "2023",
      description: "Perfect attendance and consistent practice throughout the year"
    },
    {
      id: 4,
      name: "Excellence Achiever",
      achievement: "Excellence in Smaranam",
      year: "2023", 
      description: "Outstanding memorization and understanding of Sanskrit verses"
    }
  ];

  const getIcon = (index) => {
    const icons = [Trophy, Medal, Star, Award];
    const colors = ['text-yellow-500', 'text-gray-400', 'text-amber-600', 'text-blue-500'];
    const Icon = icons[index % icons.length];
    return <Icon className={colors[index % colors.length]} size={32} />;
  };

  return (
    <div 
      className="min-h-screen py-8"
      style={{
        backgroundColor: '#ceaca4',
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 40px,
          rgba(170, 113, 99, 0.3) 40px,
          rgba(170, 113, 99, 0.3) 80px
        )`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-limelight mb-4" style={{ color: '#7e5a40' }}>
            Hall of Fame
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#7e5a40' }}>
            Celebrating the achievements of our dedicated students who have shown 
            exceptional commitment to learning Sanskrit and Vedic literature.
          </p>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {winners.map((winner, index) => (
            <div key={winner.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="p-6 text-center" style={{ backgroundColor: '#7e5a40' }}>
                <div className="bg-white p-3 rounded-full inline-block mb-4">
                  {getIcon(index)}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {winner.name}
                </h3>
                <p className="text-orange-100 text-sm">
                  {winner.year}
                </p>
              </div>
              
              <div className="p-6">
                <h4 className="text-lg font-semibold mb-3" style={{ color: '#7e5a40' }}>
                  {winner.achievement}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: '#7e5a40' }}>
                  {winner.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Categories */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-8" style={{ color: '#7e5a40' }}>
            Recognition Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#7e5a40' }}>
                <Trophy size={32} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>Excellence Award</h3>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                For outstanding performance in course completion and understanding
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#7e5a40' }}>
                <Medal size={32} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>Consistency Award</h3>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                For regular practice and unwavering dedication to learning
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#7e5a40' }}>
                <Star size={32} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>Progress Award</h3>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                For remarkable improvement and growth in Sanskrit proficiency
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#7e5a40' }}>
                <Award size={32} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>Leadership Award</h3>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                For helping fellow students and showing exemplary conduct
              </p>
            </div>
          </div>
        </div>

        {/* Inspiration Quote */}
        <div className="bg-white bg-opacity-80 rounded-lg p-8 mt-12 text-center">
          <blockquote className="text-2xl font-limelight mb-4" style={{ color: '#7e5a40' }}>
            "विद्या ददाति विनयं विनयाद्याति पात्रताम्"
          </blockquote>
          <p className="text-lg" style={{ color: '#7e5a40' }}>
            Knowledge gives humility, from humility comes worthiness
          </p>
        </div>
      </div>
    </div>
  );
};

export default Winners;
