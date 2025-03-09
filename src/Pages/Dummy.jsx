import React, { useEffect, useState } from 'react';
import  pic  from '../assets/Student_pic.webp';

function Dummy() {
  const [studentData, setStudentData] = useState(null); // State to store student data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  const token = localStorage.getItem("jwtToken"); // Retrieve the JWT token from local storage

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/students/me', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include the JWT token in the request headers
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response
        setStudentData(data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError(error.message); // Set error state
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchStudentData(); // Call the async function
  }, [token]); // Dependency array to run the effect only when `token` changes

  if (loading) {
    return <div>Loading...</div>; // Display a loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Display an error message
  }

  return (
    <div>
      <h1>Student Details</h1>
      {studentData ? (
        <div className='flex flex-col items-center'>
          <div className=' border border-grey-600  flex gap-6  h-16 w-[1280px]  items-center rounded-sm'>
            <img src={pic} className='rounded-full w-12 h-12  ml-2' />
            <div className='flex flex-col '>
          <p >{studentData.stuId}</p>
          <p className='text-grey-600 '>{studentData.stuName}</p>
          </div>
        </div>

          <p><strong>Email:</strong> {studentData.stuEmail}</p>
          <p><strong>Address:</strong> {studentData.stuAddress}</p>
          <p><strong>Mobile:</strong> {studentData.stuMobile}</p>
          <p><strong>GPA:</strong> {studentData.gpa}</p>
          <p><strong>Attendance:</strong> {studentData.attendance}%</p>
        </div>
      ) : (
        <p>No student data found.</p>
      )}
    </div>
  );
}

export default Dummy;