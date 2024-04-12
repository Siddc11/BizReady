import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import headerImg from '../assests/headerImg.png';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import '../styles/Home.css';
import { useNavigate } from "react-router-dom";


const AboutUs = () => {

  const navigate = useNavigate();

  const handleConnectClick = () => {
    navigate("/login");
  };

  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const toRotate = ["Innovative Minds", "Creative Visionaries", "Startup Enthusiasts"];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(500);
    }
  };

  return (
    <div className="landing">
      <section className="banner" id="home">
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={6} xl={7}>
              <TrackVisibility>
                {({ isVisible }) => (
                  <div className={`animate__animated ${isVisible ? 'animate__fadeIn' : ''}`}>
                    <span className="tagline">Empowering Entrepreneurs</span>
                    <h1>{`Welcome to BizReady!`} <span className="txt-rotate" data-period="2000" data-rotate='["Innovative Minds", "Creative Visionaries", "Startup Enthusiasts"]'><span className="wrap">{text}</span></span></h1>
                    <p>Join our vibrant community of innovators, creators, and startup enthusiasts. Turn your ideas into reality!</p>
                    <Button variant="primary" size="lg" onClick={handleConnectClick}>Get Started <ArrowRightCircle size={25} /></Button>
                  </div>
                )}
              </TrackVisibility>
            </Col>
            <Col xs={12} md={6} xl={5}>
              <TrackVisibility>
                {({ isVisible }) => (
                  <div className={`animate__animated ${isVisible ? 'animate__zoomIn' : ''}`}>
                    <img src={headerImg} alt="Header Img" />
                  </div>
                )}
              </TrackVisibility>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default AboutUs;
