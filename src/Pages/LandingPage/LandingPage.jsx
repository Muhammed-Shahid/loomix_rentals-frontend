import React,{useEffect,useState} from "react";
import "./LandingPage.css";
import Button from "react-bootstrap/Button";

function LandingPage() {
 const [isAuth, setIsAuth] = useState(false)
  useEffect(()=>{
    if (localStorage.getItem('access_token') !=null ){
      setIsAuth(true)
    }
  },[isAuth])

  // if (isAuth) {
  //   window.location.href = window.location.protocol + '//' + window.location.hostname+'/browse';
  // }
  return (
    <div className="container">
      <section className="banner">
        <div className="bannerContainer row">
          <div className="bannerLeft col col-md-6 col-12  p-5 ">
            <div className="bannerTxt ">
              <h1 className="">
                Rent A Car <br />
                Rent Your Fun
              </h1>

            </div>
              <div className="banner-btn-div">

            <a href="/login"> <button className="banner-btn">
              Get Started
             </button></a>
              </div>
         
          </div>

          <div className="col col-md-6 col-12 bannerRight "></div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
