import React, { useState, useEffect } from 'react';

function FeedbackPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [startTime , setStartTime] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('jwtToken');

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/students/me/courses', {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch courses');
        
        const data = await response.json();
        console.log(data)
        setEnrolledCourses(Array.isArray(data) ? data : [data]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [token]);

  // Fetch feedback questions
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchFeedbackQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/feedback/questions', {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch questions');
        
        const data = await response.json();
        setFeedbackQuestions(data);
        setStartTime(Date.now());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackQuestions();
  }, [selectedCourse, token]);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setResponses({});
    setError(null);
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitFeedback = async () => {
    if (!selectedCourse || !feedbackQuestions.length) return;
   const endTime = Date.now();
   const timeTaken = Math.floor((endTime-startTime)/1000);
  

    try {
      setSubmitting(true);
      setError(null);

      // Validate course data
      if (!selectedCourse.facultyId || !selectedCourse.courseId) {
        throw new Error("Selected course information is incomplete");
      }

      // Prepare feedback data with explicit type conversion
      const feedbackData = feedbackQuestions.map(question => ({
        facultyId: String(selectedCourse.facultyId),
        courseId: Number(selectedCourse.courseId),
        questionId: Number(question.questionId),
        responseValue: question.questionType === 'rating' 
          ? Number(responses[question.questionId] || 1)
          : null,
        responseText: question.questionType === 'text' 
          ? String(responses[question.questionId] || '')
          : null,
          timeTaken:timeTaken
      }));

      console.log("Data being sent:", JSON.stringify(feedbackData, null, 2));

      const response = await fetch('http://localhost:8080/api/feedback/responses/save', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData , null ,2)
      });

      const result = await response.text();


      
      if (!response.ok) {
        if (result.errors) {
          const errorMsg = Object.entries(result.errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join('\n');
          throw new Error(errorMsg);
        }
        throw new Error(result.message || 'Failed to submit feedback');
      }

      alert('Feedback submitted successfully!');
      setSelectedCourse(null);
      setResponses({});
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => setError(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Feedback Page</h1>
        <p className="text-gray-600">You are not enrolled in any courses.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Feedback Page</h1>

      {!selectedCourse ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Enrolled Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map(course => (
              <div
                key={`course-${course.courseId}-${course.facultyId}`}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handleCourseSelect(course)}
              >
                <h3 className="font-bold text-lg">{course.courseName}</h3>
                <p className="text-gray-600">Faculty: {course.facultyName}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-4">
            <button 
              onClick={() => setSelectedCourse(null)}
              className="mr-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              ← Back to Courses
            </button>
            <h2 className="text-xl font-semibold">
              Feedback for {selectedCourse.courseName}
            </h2>
          </div>

          <div className="space-y-6">
            {feedbackQuestions.map(question => (
              <div
                key={`question-${question.questionId}`}
                className="p-4 border rounded-lg bg-white shadow-sm"
              >
                <p className="font-semibold mb-3">{question.questionText}</p>
                
                {question.questionType === 'rating' ? (
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                      <button
                        key={`rating-${question.questionId}-${rating}`}
                        type="button"
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                          responses[question.questionId] === rating
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => handleResponseChange(question.questionId, rating)}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Type your response here..."
                    value={responses[question.questionId] || ''}
                    onChange={(e) => handleResponseChange(question.questionId, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setSelectedCourse(null)}
              className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitFeedback}
              disabled={submitting}
              className={`px-6 py-2 text-white rounded ${
                submitting ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackPage;