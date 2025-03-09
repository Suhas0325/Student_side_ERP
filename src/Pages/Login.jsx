import React, { useEffect, useState } from "react";
import Framer from "../Frames/Framer";
import Login_image from "../assets/ERP_image.jpg";
import ERP from "../assets/Logo.avif";
import LoginDetails from "../Components/LoginDetails";
import { useRecoilState } from "recoil";
import { loginId, Passwordatom } from "../Frames/Atoms";
import { useNavigate } from "react-router-dom";

const LoginForm = React.memo(()=>{
  const [Id,setId]  = useRecoilState(loginId);
  const [password,setPassword] = useRecoilState(Passwordatom);
  const [Error , setError] = useState("");
  const navigate = useNavigate();
  // http://localhost:8080/api/auth/login
  

  const HandleSubmit = async (e)=>{
    e.preventDefault();
   
    try{
      const response = await fetch("http://localhost:8080/api/auth/login",{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stuId:Id,
          password:password,
        }),
      });
      if(response.ok){
        const data = await response.text();
        const token = data;

        localStorage.setItem("jwtToken",token);
        navigate('/')
      } else{
         const errorData = await response.text();
         setError(errorData || "Authentication failed");
      }

      
    }
    catch(error){
      console.error("Error during login:", error);
      setError("An error occurred during login");
    }
  }
   
  return(
    <div className="mt-[100px]  flex flex-col  items-center ">
            <h2 className="text-black-700 font-sans">Enter Details to Login</h2>
            <form className="flex flex-col mt-3 gap-5" onSubmit={HandleSubmit}>
              <input
                type="text"
                placeholder="Enter ID"
                className="px-2 py-2 rounded border-solid border-black border-2 w-[300px]"
                onChange={(e)=>setId(e.target.value)}
                value={Id}
              />
              <input
                type="password"
                placeholder="Enter password"
                className="px-2 py-2 rounded border-solid border-black border-2"
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
              ></input>
                {Error && <p className="text-red-500">{Error}</p>}
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
              >
                Login
              </button>
            </form>
          </div>
  );

  
})

function Login() {


  
  return (
    <Framer>
      <>
        <div className="flex flex-row justify-center h-[500px]">

          <div className="border border-grey-700 w-[600px] rounded-md ">
          <div className="flex flex-col ">
            <div className="flex items-center gap-3 mr-auto ml-2 mt-2">
              <img
                alt="Logo"
                width="300"
                height="400"
                decoding="async"
                className="rounded-full size-10"
                src={ERP}
                style={{ color: "transparent" }}
              ></img>

              <span className="text-base md:text-base font-bold tracking-tight text-foreground  md:block font-medium">
                ERP Login
              </span>
            </div>
          </div>
             <LoginForm/>
          
          </div>
        
          <img
            alt="ERP"
            src={Login_image}
            width="400"
            height="400"
            className="w-[400px] rounded-xl"
          ></img>
        </div>
        <div className="flex items-center justify-center">
          <LoginDetails />
        </div>
      </>
    </Framer>
  );
}

export default Login;
