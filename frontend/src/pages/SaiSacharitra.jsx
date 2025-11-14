import React from 'react';
import { BookOpen, Heart, Star, Sparkles } from 'lucide-react';

const SaiSacharitra = () => {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-limelight mb-4" style={{ color: '#7e5a40' }}>
            Sai Sacharitra
          </h1>
          <p className="text-xl" style={{ color: '#7e5a40' }}>
            The Sacred Biography of Shri Sai Baba of Shirdi
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <BookOpen className="mr-3" style={{ color: '#7e5a40' }} size={32} />
            <h2 className="text-2xl font-semibold" style={{ color: '#7e5a40' }}>About Sai Sacharitra</h2>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="leading-relaxed mb-6" style={{ color: '#7e5a40' }}>
              Sai Sacharitra, also known as Shri Sai Satcharitra, is the sacred biography of 
              Shri Sai Baba of Shirdi. Written by Hemadpant (Govind Raghunath Dabholkar), 
              this holy text chronicles the life, teachings, and miraculous deeds of the 
              beloved saint who lived in Shirdi, Maharashtra.
            </p>
            
            <p className="leading-relaxed mb-6" style={{ color: '#7e5a40' }}>
              The book consists of 51 chapters and is considered one of the most important 
              spiritual texts for devotees of Sai Baba. It contains stories of Baba's 
              divine leelas (miraculous acts), his teachings about devotion, surrender, 
              and the path to spiritual enlightenment.
            </p>
          </div>
        </div>

        {/* Key Teachings */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Heart className="mr-3" style={{ color: '#7e5a40' }} size={32} />
            <h2 className="text-2xl font-semibold" style={{ color: '#7e5a40' }}>Key Teachings of Sai Baba</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-50 border-l-4 p-6 rounded-r-lg" style={{ borderColor: '#7e5a40' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#7e5a40' }}>Sabka Malik Ek</h3>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                "One God governs all" - Baba taught the unity of all religions and 
                the importance of seeing the divine in all beings.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-50 border-l-4 p-6 rounded-r-lg" style={{ borderColor: '#7e5a40' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#7e5a40' }}>Shraddha and Saburi</h3>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                Faith (Shraddha) and Patience (Saburi) are the two fundamental 
                qualities needed for spiritual progress.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-50 border-l-4 p-6 rounded-r-lg" style={{ borderColor: '#7e5a40' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#7e5a40' }}>Service to Others</h3>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                Selfless service to humanity is the path to divine realization 
                and spiritual growth.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-50 border-l-4 p-6 rounded-r-lg" style={{ borderColor: '#7e5a40' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#7e5a40' }}>Surrender to God</h3>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                Complete surrender to the divine will leads to peace, happiness, 
                and liberation from worldly sufferings.
              </p>
            </div>
          </div>
        </div>

        {/* Famous Sayings */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Star className="mr-3" style={{ color: '#7e5a40' }} size={32} />
            <h2 className="text-2xl font-semibold" style={{ color: '#7e5a40' }}>Famous Sayings of Sai Baba</h2>
          </div>
          
          <div className="space-y-6">
            <blockquote className="text-white p-6 rounded-lg" style={{ backgroundColor: '#7e5a40' }}>
              <p className="text-lg font-medium mb-2">
                "Why fear when I am here?"
              </p>
              <p className="text-sm opacity-90">
                Baba's reassurance to his devotees, promising his eternal protection and guidance.
              </p>
            </blockquote>
            
            <blockquote className="text-white p-6 rounded-lg" style={{ backgroundColor: '#7e5a40' }}>
              <p className="text-lg font-medium mb-2">
                "If you look to me, I look to you."
              </p>
              <p className="text-sm opacity-90">
                The reciprocal nature of devotion and divine grace.
              </p>
            </blockquote>
            
            <blockquote className="text-white p-6 rounded-lg" style={{ backgroundColor: '#7e5a40' }}>
              <p className="text-lg font-medium mb-2">
                "I am formless and everywhere. I am in everything and beyond."
              </p>
              <p className="text-sm opacity-90">
                Baba's teaching about the omnipresent nature of the divine.
              </p>
            </blockquote>
          </div>
        </div>

        {/* Reading Benefits */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Sparkles className="mr-3" style={{ color: '#7e5a40' }} size={32} />
            <h2 className="text-2xl font-semibold" style={{ color: '#7e5a40' }}>Benefits of Reading Sai Sacharitra</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4" style={{ color: '#7e5a40' }}>Spiritual Benefits</h3>
              <ul className="space-y-2" style={{ color: '#7e5a40' }}>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: '#7e5a40' }}>•</span>
                  Increases devotion and faith
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: '#7e5a40' }}>•</span>
                  Provides spiritual guidance and wisdom
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: '#7e5a40' }}>•</span>
                  Helps in developing patience and surrender
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: '#7e5a40' }}>•</span>
                  Connects the reader with Baba's divine energy
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4" style={{ color: '#7e5a40' }}>Personal Benefits</h3>
              <ul className="space-y-2" style={{ color: '#7e5a40' }}>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: '#7e5a40' }}>•</span>
                  Brings peace and mental tranquility
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: '#7e5a40' }}>•</span>
                  Provides solutions to life's problems
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: '#7e5a40' }}>•</span>
                  Increases positive thinking and optimism
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ color: '#7e5a40' }}>•</span>
                  Strengthens moral and ethical values
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Closing Prayer */}
        <div className="bg-white bg-opacity-80 rounded-lg p-8 mt-12 text-center">
          <p className="text-2xl font-limelight mb-4" style={{ color: '#7e5a40' }}>
            श्री सच्चिदानंद सद्गुरु साईनाथ महाराज की जय!
          </p>
          <p className="text-lg" style={{ color: '#7e5a40' }}>
            Victory to Shri Sai Nath, the True Guru, the Embodiment of Truth, Consciousness, and Bliss!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaiSacharitra;
