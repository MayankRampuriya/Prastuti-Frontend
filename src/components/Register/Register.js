import React, { useState, useEffect } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
// import image from "../assets/Register/logo.png";
// import style from "../assets/Register/style.css"
import axios from "axios";
// import React from "react";
import image from "./logo.png";
import "./Register.css";
import Loader from "../Loader/loader"

const Register = () => {
  const [profile, setProfile] = useState([]);
  const [value, setvalue] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );
  const [showLoader, setShowLoader] = useState(false);
  const [loaderText, setLoaderText] = useState("");

  const showLoaderWithMessage = (message) => {
    setLoaderText(message);
    setShowLoader(true);
  };

  const hideLoader = () => {
    setShowLoader(false);
  };

  const clientId = process.env.REACT_APP__CLIENT_ID;
  // const clientId = "942144718176-gg7n0gvjtu6abbjv790vn99i6kr5i315.apps.googleusercontent.com";
  useEffect(() => {

    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);


    if (localStorage.getItem("loginData")) {
      window.location.replace("/form");
    }
  });
  const onSuccess = async (res) => {
    console.log(res)
    showLoaderWithMessage("Signing In");
    setProfile(res.profileObj);
    // console.log(res.tokenId, process.env.REACT_APP_SECRET_KEY);
    const data = await axios.post(
      `http://localhost:8000/api/login`,
      { tokenId: res.tokenId }
    );
    localStorage.setItem("loginData", data.data.user._id);
    hideLoader();
    if (data.data.user.isFormFilled) {
      window.location.replace("/profile");
    } else {
      window.location.replace("/form");
    }
  };

  const onFailure = (err) => {
    console.log(err)
    console.log("failed", err);
  };

  const logOut = () => {
    localStorage.removeItem("loginData");
    setProfile(null);
    setvalue(null);
  };
  return (
    <div className="main relative bg-no-repeat bg-cover h-screen light-gradient bg-center">
      {showLoader ? <Loader text={loaderText} /> : null}
      <span className="absolute flex align-middle justify-center h-screen">
        <svg
          class="blob absolute justify-center align-middle"
          width={900}
          height={900}
          viewBox="0 0 450 450"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(225,250)">
            <path
              fill="#003247"
              d="M120,-157.6C152.7,-141.5,174.3,-102.6,194.8,-58.8C215.3,-14.9,234.6,33.8,228.4,80.8C222.2,127.8,190.4,173.1,148.1,184C105.8,195,52.9,171.5,-2.4,174.8C-57.8,178.2,-115.6,208.4,-137.5,190.9C-159.3,173.3,-145.3,108,-153,56.3C-160.7,4.6,-190.2,-33.4,-178.3,-54.2C-166.4,-75.1,-113.2,-78.8,-76.6,-93.6C-40,-108.3,-20,-134.2,11.9,-150.5C43.7,-166.8,87.4,-173.6,120,-157.6Z"
            />
          </g>
        </svg>
      </span>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="absolute z-10 flex h-[37rem] w-[22rem] sm:w-[30rem] mt-30 bg-[#DBF2FF] mx-auto shadow-2xl shadow-dark-neon-tint rounded-lg bg-opacity-65 lg:max-w-4xl">
          {" "}
          <div className="absolute w-full content-center p-6 md:px-8 ">
            <h2 className="text-2xl font-semibold text-center text-gray-700">
              Prastuti'23
            </h2>
            <p className="text-xl text-center text-gray-600">Welcome back!</p>
            <div className="flex items-center justify-center mt-4">
              <img src={image} alt="logo" className="w-[25rem] h-[25rem] " />
            </div>
            <div
              // href="#"
              className="flex items-center justify-center mt-4 bg-[#003247] text-[#DBF2FF] transition-colors duration-300 transform border rounded-lg  hover:text-[#003247] hover:border-[#003247] focus:outline-none focus:bg-[#DBF2FF] focus:text-[#003247] focus:border-[#003247]"
            >
              
              <span className="align-top justify-center w-5/6 px-4 py-3 font-bold text-center">
                {/* Sign in with Google  */}

                <GoogleLogin
                  className="align-top justify-center w-5/6 px-4 py-3 font-bold text-black text-center loginBtn"
                  clientId={clientId}
                  buttonText="Sign in with Google"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  cookiePolicy={"single_host_origin"}
                  style={{ backgroundColor: "rgba(0,0,0,0.5)!important" }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
