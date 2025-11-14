import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Upload, 
  UserPlus, 
  UserMinus, 
  Clock,
  FileText,
  Music
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  const [uploadData, setUploadData] = useState({
    courseId: '',
    materialType: 'lyrics',
    file: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, coursesRes, progressRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/students`),
        axios.get(`${API_BASE_URL}/courses`),
        axios.get(`${API_BASE_URL}/progress`),
        axios.get(`${API_BASE_URL}/student-assignments`)
      ]);

      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      setProgress(progressRes.data);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const assignCourse = async (userId, courseId) => {
    try {
      await axios.post(`${API_BASE_URL}/assign-course`, null, {
        params: { user_id: userId, course_id: courseId }
      });
      alert('Course assigned successfully!');
      fetchData(); // Refresh data
    } catch (err) {
      alert('Failed to assign course: ' + (err.response?.data?.detail || 'Unknown error'));
    }
  };

  const unassignCourse = async (userId, courseId) => {
    try {
      await axios.delete(`${API_BASE_URL}/unassign-course`, {
        params: { user_id: userId, course_id: courseId }
      });
      alert('Course unassigned successfully!');
      fetchData(); // Refresh data
    } catch (err) {
      alert('Failed to unassign course: ' + (err.response?.data?.detail || 'Unknown error'));
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadData.file || !uploadData.courseId) {
      alert('Please select a file and course');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('course_id', uploadData.courseId);
    formData.append('material_type', uploadData.materialType);

    try {
      await axios.post(`${API_BASE_URL}/upload-material`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Material uploaded successfully!');
      setUploadData({ courseId: '', materialType: 'lyrics', file: null });
      document.getElementById('file-upload').value = '';
    } catch (err) {
      alert('Failed to upload material: ' + (err.response?.data?.detail || 'Unknown error'));
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
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
          <h1 className="text-3xl font-limelight mb-2" style={{ color: '#7e5a40' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#7e5a40' }}>
            Manage students, courses, and track learning progress
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'students', label: 'Students', icon: Users },
                { id: 'courses', label: 'Courses', icon: BookOpen },
                { id: 'assignments', label: 'Assigned Students', icon: UserPlus },
                { id: 'progress', label: 'Progress', icon: BarChart3 },
                { id: 'upload', label: 'Upload Materials', icon: Upload }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    style={{ 
                      color: activeTab === tab.id ? 'white' : '#7e5a40',
                      backgroundColor: activeTab === tab.id ? '#7e5a40' : 'transparent',
                      borderColor: activeTab === tab.id ? '#7e5a40' : 'transparent'
                    }}
                  >
                    <Icon className="mr-2" size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Management</h2>
                
                {students.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto text-gray-400 mb-4" size={64} />
                    <p className="text-gray-500">No students registered yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student & Current Assignments
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assign/Remove Courses
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => {
                          // Get assigned courses for this student
                          const studentAssignments = assignments.filter(a => a.user_id === student.id);
                          const assignedCourseIds = studentAssignments.map(a => a.course_id);
                          const availableCourses = courses.filter(c => !assignedCourseIds.includes(c.id));
                          
                          return (
                            <tr key={student.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.first_name} {student.last_name}
                                </div>
                                {studentAssignments.length > 0 && (
                                  <div className="text-xs mt-1" style={{ color: '#7e5a40' }}>
                                    Assigned: {studentAssignments.map(a => a.course_name).join(', ')}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        assignCourse(student.id, parseInt(e.target.value));
                                        e.target.value = '';
                                      }
                                    }}
                                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                                    disabled={availableCourses.length === 0}
                                  >
                                    <option value="">
                                      {availableCourses.length === 0 ? 'All Courses Assigned' : 'Assign Course'}
                                    </option>
                                    {availableCourses.map((course) => (
                                      <option key={course.id} value={course.id}>
                                        {course.name}
                                      </option>
                                    ))}
                                  </select>
                                  
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        unassignCourse(student.id, parseInt(e.target.value));
                                        e.target.value = '';
                                      }
                                    }}
                                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                                    disabled={studentAssignments.length === 0}
                                  >
                                    <option value="">
                                      {studentAssignments.length === 0 ? 'No Courses to Remove' : 'Remove Course'}
                                    </option>
                                    {studentAssignments.map((assignment) => (
                                      <option key={assignment.course_id} value={assignment.course_id}>
                                        {assignment.course_name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Course Management</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {course.name}
                        </h3>
                        <div className="text-white p-2 rounded-full" style={{ backgroundColor: '#7e5a40' }}>
                          <BookOpen size={20} />
                        </div>
                      </div>
                      
                      {course.description && (
                        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                      )}
                      
                      <div className="text-sm text-gray-500">
                        Course ID: {course.id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assigned Students Tab */}
            {activeTab === 'assignments' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student-Course Assignments</h2>
                
                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <UserPlus className="mx-auto text-gray-400 mb-4" size={64} />
                    <p className="text-gray-500">No student assignments found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assigned Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assigned Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {assignments.map((assignment, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Users className="mr-3" style={{ color: '#7e5a40' }} size={20} />
                                <div className="text-sm font-medium text-gray-900">
                                  {assignment.student_name}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{assignment.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <BookOpen className="mr-2" style={{ color: '#7e5a40' }} size={16} />
                                <span className="text-sm text-gray-900 font-medium">
                                  {assignment.course_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {assignment.assigned_at ? 
                                new Date(assignment.assigned_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'Unknown'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Summary Statistics */}
                {assignments.length > 0 && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white bg-opacity-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <Users className="mr-3" style={{ color: '#7e5a40' }} size={24} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#7e5a40' }}>Total Assignments</p>
                          <p className="text-2xl font-bold" style={{ color: '#7e5a40' }}>{assignments.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white bg-opacity-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <Users className="mr-3" style={{ color: '#7e5a40' }} size={24} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#7e5a40' }}>Unique Students</p>
                          <p className="text-2xl font-bold" style={{ color: '#7e5a40' }}>
                            {new Set(assignments.map(a => a.student_id)).size}
                          </p>
                        </div>
                      </div>
                    </div>                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <BookOpen className="text-purple-600 mr-3" size={24} />
                        <div>
                          <p className="text-sm font-medium text-purple-600">Active Courses</p>
                          <p className="text-2xl font-bold text-purple-900">
                            {new Set(assignments.map(a => a.course_id)).size}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Progress</h2>
                
                {progress.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="mx-auto text-gray-400 mb-4" size={64} />
                    <p className="text-gray-500">No progress data available yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time Spent
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sessions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {progress.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {item.student_name}
                              </div>
                              <div className="text-sm text-gray-500">{item.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.course_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <Clock className="mr-2" size={16} />
                                {formatTime(item.total_seconds)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.session_count}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Course Materials</h2>
                
                <form onSubmit={handleFileUpload} className="max-w-lg space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Course
                    </label>
                    <select
                      value={uploadData.courseId}
                      onChange={(e) => setUploadData({...uploadData, courseId: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-saffron focus:border-saffron"
                      required
                    >
                      <option value="">Choose a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="lyrics"
                          checked={uploadData.materialType === 'lyrics'}
                          onChange={(e) => setUploadData({...uploadData, materialType: e.target.value})}
                          className="mr-2"
                        />
                        <FileText className="mr-2" size={16} />
                        Lyrics
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="recordings"
                          checked={uploadData.materialType === 'recordings'}
                          onChange={(e) => setUploadData({...uploadData, materialType: e.target.value})}
                          className="mr-2"
                        />
                        <Music className="mr-2" size={16} />
                        Recordings
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select File
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-saffron focus:border-saffron"
                      accept={uploadData.materialType === 'recordings' ? 'audio/*' : '.pdf,.txt,.docx'}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {uploadData.materialType === 'recordings' 
                        ? 'Supported formats: MP3, WAV, M4A' 
                        : 'Supported formats: PDF, TXT, DOCX'
                      }
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors duration-200"
                    style={{ backgroundColor: '#7e5a40' }}
                  >
                    <Upload className="mr-2" size={16} />
                    Upload Material
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
