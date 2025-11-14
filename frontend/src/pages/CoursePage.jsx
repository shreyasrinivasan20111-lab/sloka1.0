import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Play, Pause, FileText, Music, Clock, Upload } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState({ lyrics: [], recordings: [] });
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseData();
    startTimeTracking();
    
    return () => {
      if (isTimerActive) {
        stopTimeTracking();
      }
    };
  }, [courseId]);

  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimeSpent(time => time + 1);
      }, 1000);
    } else if (!isTimerActive && timeSpent !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeSpent]);

  const fetchCourseData = async () => {
    try {
      const [coursesResponse, materialsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/courses`),
        axios.get(`${API_BASE_URL}/course-materials/${courseId}`)
      ]);

      const foundCourse = coursesResponse.data.find(c => c.id === parseInt(courseId));
      setCourse(foundCourse);

      const groupedMaterials = materialsResponse.data.reduce((acc, material) => {
        if (!acc[material.material_type]) {
          acc[material.material_type] = [];
        }
        acc[material.material_type].push(material);
        return acc;
      }, { lyrics: [], recordings: [] });

      setMaterials(groupedMaterials);
    } catch (err) {
      setError('Failed to fetch course data');
      console.error('Error fetching course data:', err);
    } finally {
      setLoading(false);
    }
  };

  const startTimeTracking = async () => {
    try {
      await axios.post(`${API_BASE_URL}/time-tracking/start`, null, {
        params: { course_id: courseId }
      });
      setIsTimerActive(true);
    } catch (err) {
      console.error('Error starting time tracking:', err);
    }
  };

  const stopTimeTracking = async () => {
    try {
      await axios.post(`${API_BASE_URL}/time-tracking/stop`);
      setIsTimerActive(false);
    } catch (err) {
      console.error('Error stopping time tracking:', err);
    }
  };

  const toggleTimer = () => {
    if (isTimerActive) {
      stopTimeTracking();
    } else {
      startTimeTracking();
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#7e5a40' }}></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
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
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#7e5a40' }}>Course Not Found</h2>
          <p style={{ color: '#7e5a40' }}>{error || 'The requested course could not be found.'}</p>
        </div>
      </div>
    );
  }

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
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-limelight mb-2" style={{ color: '#7e5a40' }}>
                {course.name}
              </h1>
              {course.description && (
                <p style={{ color: '#7e5a40' }}>{course.description}</p>
              )}
            </div>
            
            {/* Timer */}
            <div className="flex items-center space-x-4">
              <div className={`bg-white bg-opacity-90 px-6 py-3 rounded-lg shadow-md ${isTimerActive ? 'timer-active' : ''}`}>
                <div className="flex items-center">
                  <Clock className="mr-2" style={{ color: '#000000' }} size={20} />
                  <span className="text-xl font-mono font-semibold" style={{ color: '#000000' }}>
                    {formatTime(timeSpent)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={toggleTimer}
                className={`flex items-center px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  isTimerActive
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'text-white hover:bg-opacity-80'
                }`}
                style={{
                  backgroundColor: isTimerActive ? undefined : '#7e5a40'
                }}
              >
                {isTimerActive ? (
                  <>
                    <Pause className="mr-2" size={16} />
                    Pause Timer
                  </>
                ) : (
                  <>
                    <Play className="mr-2" size={16} />
                    Start Timer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Course Materials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lyrics Section */}
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <FileText className="mr-3" style={{ color: '#7e5a40' }} size={24} />
              <h2 className="text-2xl font-semibold" style={{ color: '#7e5a40' }}>Lyrics</h2>
            </div>

            {materials.lyrics && materials.lyrics.length > 0 ? (
              <div className="space-y-4">
                {materials.lyrics.map((material) => (
                  <div key={material.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>
                      {material.filename}
                    </h3>
                    <a
                      href={`/api/${material.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors duration-200"
                      style={{ backgroundColor: '#7e5a40' }}
                    >
                      <FileText className="mr-2" size={16} />
                      View Lyrics
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto text-gray-400 mb-4" size={64} />
                <p style={{ color: '#7e5a40' }}>No lyrics available yet</p>
              </div>
            )}
          </div>

          {/* Recordings Section */}
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Music className="mr-3" style={{ color: '#7e5a40' }} size={24} />
              <h2 className="text-2xl font-semibold" style={{ color: '#7e5a40' }}>Recordings</h2>
            </div>

            {materials.recordings && materials.recordings.length > 0 ? (
              <div className="space-y-4">
                {materials.recordings.map((material) => (
                  <div key={material.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>
                      {material.filename}
                    </h3>
                    <audio
                      controls
                      className="w-full mb-3"
                      src={`/api/${material.file_path}`}
                    >
                      Your browser does not support the audio element.
                    </audio>
                    <a
                      href={`/api/${material.file_path}`}
                      download
                      className="inline-flex items-center text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors duration-200"
                      style={{ backgroundColor: '#7e5a40' }}
                    >
                      <Music className="mr-2" size={16} />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="mx-auto text-gray-400 mb-4" size={64} />
                <p style={{ color: '#7e5a40' }}>No recordings available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Study Tips */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#7e5a40' }}>Study Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#7e5a40' }}>
                <FileText size={20} />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>Read the Lyrics</h4>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                Start by reading and understanding the Sanskrit text and its meaning.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#7e5a40' }}>
                <Music size={20} />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>Listen to Recordings</h4>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                Practice pronunciation by listening to the audio recordings repeatedly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#7e5a40' }}>
                <Clock size={20} />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: '#7e5a40' }}>Track Your Progress</h4>
              <p className="text-sm" style={{ color: '#7e5a40' }}>
                Use the timer to track your study sessions and build consistent practice habits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
