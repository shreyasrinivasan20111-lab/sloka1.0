import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div 
      className="min-h-screen flex flex-col"
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
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-limelight text-6xl md:text-8xl mb-8 drop-shadow-lg" style={{ color: '#7e5a40' }}>
            Welcome To Sai Kalpataru
          </h1>
          
          <div className="bg-white bg-opacity-80 rounded-lg p-8 mb-8 shadow-2xl">
            <p className="text-lg md:text-xl leading-relaxed font-nova-round" style={{ color: '#7e5a40' }}>
              Sai Kalpataru Vidyalaya is a non-profit organization. It was formed in the year 2020, 
              which began with teaching bhajans for young kids. Later, this evolved into a structured 
              curriculum where shlokas from Vedic literature are taught throughout the academic year.
            </p>
            <p className="text-lg md:text-xl leading-relaxed mt-4 font-nova-round" style={{ color: '#7e5a40' }}>
              The mission of this institution is to spread the word of Sanatana Dharma to the world 
              and instill spiritual practice in young minds through recital of shlokas in Sanskrit language.
            </p>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            {isAuthenticated ? (
              <div className="space-x-4">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="inline-block bg-green text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-green-700 transition-colors duration-200 transform hover:scale-105"
                  >
                    Go to Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-block bg-saffron text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-orange-600 transition-colors duration-200 transform hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="inline-block bg-saffron text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-orange-600 transition-colors duration-200 transform hover:scale-105"
                >
                  Join Our Community
                </Link>
                <Link
                  to="/login"
                  className="inline-block bg-green text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-green-700 transition-colors duration-200 transform hover:scale-105"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Class Information Section */}
      <div className="bg-white bg-opacity-80 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-limelight mb-4" style={{ color: '#7e5a40' }}>
              Sai Kalpataru Vidyalaya
            </h2>
            <p className="text-xl mb-2 font-nova-round" style={{ color: '#7e5a40' }}>
              at Om Sri Sai Balaji Temple, Monroe, NJ
            </p>
            <p className="text-2xl font-limelight mb-4" style={{ color: '#7e5a40' }}>
              śloka & Sai Satcharitra Class
            </p>
            <hr className="border-t-2 w-full mb-8" style={{ borderColor: '#7e5a40' }} />
            <p className="text-2xl font-limelight mb-8" style={{ color: '#7e5a40' }}>
              Jai Sairam!
            </p>
          </div>

          <div className="bg-white bg-opacity-60 rounded-lg p-8 shadow-lg">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed font-nova-round" style={{ color: '#7e5a40' }}>
                <strong style={{ color: '#7e5a40' }}>śravaṇaṃ</strong> is the beginner level śloka and Sai Satcharitra class. 
                (Both new and the returning students are required to register using the LINK given in the last section of this document). 
                If your child has already learned some śloka, we can evaluate for placement in the correct level.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-white bg-opacity-70 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <p className="font-nova-round" style={{ color: '#7e5a40' }}>
                      <span className="font-bold text-lg" style={{ color: '#7e5a40' }}>When</span>: Aug '25 to June '26. Class duration is 45 minutes, meeting once a week, on Saturdays.
                    </p>
                  </div>

                  <div className="bg-white bg-opacity-70 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <p className="font-nova-round" style={{ color: '#7e5a40' }}>
                      <span className="font-bold text-lg" style={{ color: '#7e5a40' }}>Where</span>: Online Zoom Class (link will be provided upon registration).
                    </p>
                  </div>

                  <div className="bg-white bg-opacity-70 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <p className="font-nova-round" style={{ color: '#7e5a40' }}>
                      <span className="font-bold text-lg" style={{ color: '#7e5a40' }}>Who</span>: For kids aged 5 years or older.
                    </p>
                  </div>

                  <div className="bg-white bg-opacity-70 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <p className="font-nova-round" style={{ color: '#7e5a40' }}>
                      <span className="font-bold text-lg" style={{ color: '#7e5a40' }}>Medium of Instruction</span>: English.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white bg-opacity-70 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <p className="mb-3 font-nova-round" style={{ color: '#7e5a40' }}>
                      <span className="font-bold text-lg" style={{ color: '#7e5a40' }}>How it Works</span>:
                    </p>
                    <ul className="space-y-2 text-sm ml-4 font-nova-round" style={{ color: '#7e5a40' }}>
                      <li>• ślokas are based in Sanskrit language.</li>
                      <li>• Lyrics will be in English language.</li>
                      <li>• During the class, students will be made to repeat after the teacher.</li>
                      <li>• Audio recording and lyrics will be provided for practice.</li>
                      <li>• During the week, parents are required to work with kids to ensure they practice the previous week's lessons at home on a daily basis.</li>
                      <li>• Prior week lessons will be revised in the class before beginning a new lesson.</li>
                      <li>• Kids will listen to (from level 2, they will start reading) and discuss new stories from Shirdi Sai Satcharitra in the class.</li>
                      <li>• Assessments will be held at the end of the year. Additionally, a minimum of 80% attendance is required to move on to the next level.</li>
                      <li>• Students will get to recite in the temple for festivals, as schedule permits.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <p className="leading-relaxed font-nova-round" style={{ color: '#7e5a40' }}>
                  <span className="font-bold text-xl" style={{ color: '#7e5a40' }}>Year-end Graduation Ceremony</span>: 
                  Conducted in the Om Sai Balaji Temple, Monroe, NJ. All graduates will receive a certificate from the temple founder. 
                  Winners will receive trophies and medals. Out of state graduates will get the certificates via regular mail.
                </p>
              </div>

              <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <p className="leading-relaxed font-nova-round" style={{ color: '#7e5a40' }}>
                  <span className="font-bold text-xl" style={{ color: '#7e5a40' }}>Suggested Donation</span>: 
                  As a contribution towards the <strong>Hanuman tower construction</strong> in the Om Sai Balaji Temple, Monroe NJ, 
                  we suggest a donation of <strong style={{ color: '#7e5a40' }}>$100 per child per year</strong>.
                </p>
                <p className="text-sm mt-2 font-nova-round" style={{ color: '#7e5a40' }}>
                  Payment details will be given upon enrollment.
                </p>
              </div>

              <div className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <p className="mb-3 font-nova-round" style={{ color: '#7e5a40' }}>
                  <span className="font-bold text-xl" style={{ color: '#7e5a40' }}>Registration Link</span>:
                </p>
                <a 
                  href="https://docs.google.com/document/d/1AbtC_oGg_Pb-PXhpJiUUaS4N_sTWb83D/edit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline text-lg font-medium break-all block mb-3 font-nova-round hover:opacity-80"
                  style={{ color: '#7e5a40' }}
                >
                  https://docs.google.com/document/d/1AbtC_oGg_Pb-PXhpJiUUaS4N_sTWb83D/edit
                </a>
                <div className="bg-yellow-100 bg-opacity-80 p-3 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm font-nova-round" style={{ color: '#7e5a40' }}>
                    <strong>Important:</strong> If you're registering more than one child, please submit the form again with the details of the second child (i.e. one form per child).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white bg-opacity-80 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg" style={{ color: '#7e5a40' }}>
            &copy; 2024 Sai Kalpataru Vidyalaya. All rights reserved.
          </p>
          <p className="text-sm mt-2" style={{ color: '#7e5a40' }}>
            Spreading the wisdom of Sanatana Dharma through Sanskrit education
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
