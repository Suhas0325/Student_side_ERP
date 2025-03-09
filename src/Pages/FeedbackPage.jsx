import React, { useState, useEffect } from 'react';

function FeedbackPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([]); // Initialize as an empty array
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true); // Add a loading state
  const token = localStorage.getItem('jwtToken');

  // Fetch enrolled courses when the component mounts
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/students/me/courses', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Log the response

        // Ensure the response is an array
        const courses = Array.isArray(data) ? data : [data];
        setEnrolledCourses(courses);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        alert('Failed to fetch enrolled courses. Please try again.');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchEnrolledCourses();
  }, [token]);

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setResponses({}); // Reset responses when a new course is selected
  };

  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    if (!selectedCourse || !feedbackQuestions.length) return;

    try {
      const feedbackData = feedbackQuestions.map((question) => ({
        studentId: localStorage.getItem('studentId'),
        facultyId: selectedCourse.facultyId,
        courseId: selectedCourse.courseId,
        questionId: question.questionId,
        responseValue: responses[question.questionId] || null, // For rating questions
        responseText: responses[question.questionId] || '', // For text-based questions
      }));

      const response = await fetch('/api/feedback/responses', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert('Feedback submitted successfully!');
      setSelectedCourse(null); // Reset selected course after submission
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  // Handle response change for feedback questions
  const handleResponseChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show empty state
  if (enrolledCourses.length === 0) {
    return <div>No courses found. You are not enrolled in any courses.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Feedback Page</h1>

      {/* Display enrolled courses */}
      {!selectedCourse && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Enrolled Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course, index) => (
              <div
                key={`course-${index}`} // Unique key for each course
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handleCourseSelect(course)}
              >
                <h3 className="font-bold">{course.courseName}</h3>
                <p>Faculty: {course.facultyName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display feedback questions for the selected course */}
      {selectedCourse && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Feedback for {selectedCourse.courseName} (Faculty: {selectedCourse.facultyName})
          </h2>
          <div className="space-y-4">
            {feedbackQuestions.map((question) => (
              <div key={`question-${question.questionId}`} className="p-4 border rounded-lg">
                <p className="font-semibold">{question.questionText}</p>
                {question.questionType === 'rating' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <button
                        key={`rating-${rating}`}
                        className={`px-4 py-2 border rounded ${
                          responses[question.questionId] === rating
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100'
                        }`}
                        onClick={() => handleResponseChange(question.questionId, rating)}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                )}
                {question.questionType === 'text' && (
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Your response..."
                    value={responses[question.questionId] || ''}
                    onChange={(e) =>
                      handleResponseChange(question.questionId, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <button
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmitFeedback}
          >
            Submit Feedback
          </button>
          <button
            className="mt-6 ml-4 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setSelectedCourse(null)}
          >
            Back to Courses
          </button>
        </div>
      )}
    </div>
  );
}

export default FeedbackPage;