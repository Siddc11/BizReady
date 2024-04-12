import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate();
  const styles = {
    ".page_404": {
      padding: "40px 0",
      background: "#fff"
    },
    ".page_404  img": { width: "100%" },
    ".four_zero_four_bg": {
      backgroundImage:
        "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
      height: "400px",
      backgroundPosition: "center",
    },
    ".four_zero_four_bg h1": { fontSize: "80px" },
    ".four_zero_four_bg h3": { fontSize: "80px" },
    ".contant_box_404": { marginTop: "-50px" }
  }
  
  return (
    <section style={styles['.page_404']}>
      <div className="container">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-center align-items-center">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div style={styles['.four_zero_four_bg']}>
                <h1 className="text-center ">404</h1>
              </div>

              <div style={styles['.contant_box_404']}>
                <h3 className="h2">
                  Look like you're lost
                </h3>

                <p>the page you are looking for not avaible!</p>

                <a href="" className='btn btn-success' style={styles['.link_404']} onClick={()=>{navigate("/")}}>Go to Home</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound