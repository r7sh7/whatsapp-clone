import React, { useState } from "react";
import styled from "styled-components";
import firebase from "firebase";
import { auth } from "../../config/fbconfig";
import { useHistory } from "react-router";

const LoginScreen = () => {
  const [pno, setPno] = useState("+91 ");
  const [otp, setOtp] = useState("");
  const [show, setShow] = useState(false);
  const [result, setResult] = useState();
  const [err, setErr] = useState("err");

  const history = useHistory();

  const getOtp = (e) => {
    e.preventDefault();
    if (pno === "" || pno.length < 12) return;
    let verify = new firebase.auth.RecaptchaVerifier("recaptcha-container");
    auth
      .signInWithPhoneNumber(pno, verify)
      .then((result) => {
        setResult(result);
        setShow(true);
      })
      .catch((err) => {
        alert(err);
        window.location.reload();
      });
  };

  const validateOtp = () => {
    if (otp === null) return;
    result
      .confirm(otp)
      .then((userAuth) => {
        // success
        if (
          userAuth.user.metadata.creationTime ===
          userAuth.user.metadata.lastSignInTime
        ) {
          history.push("/loginform");
        }
      })
      .catch((err) => {
        alert("Wrong code");
      });
  };

  const checkNumber = (pnoEntered) => {
    if (pnoEntered.substring(0, 3) !== "+91") {
      setErr("Number should begin with +91");
      console.log(err);
    } else {
      setPno(pnoEntered.split(" ").join(""));
    }
  };

  return (
    <Container>
      <LoginContainer show={show}>
        <h1>Welcome to the WhatsApp Clone!</h1>
        <Logo src="/images/logo.svg" />
        <InputField
          placeholder="Enter your phone number"
          value={pno}
          onChange={(e) => checkNumber(e.target.value)}
        />
        <p>Enter your 10 digit mobile number</p>
        <div id="recaptcha-container"></div>
        <Button onClick={getOtp}>Get OTP</Button>
      </LoginContainer>
      <OtpContainer show={show}>
        <h2>OTP sent to {pno}</h2>
        <Logo src="/images/logo.svg" />
        <InputField
          placeholder="Enter your OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button onClick={validateOtp}>Verify</Button>
      </OtpContainer>
    </Container>
  );
};

export default LoginScreen;

const Container = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  background-color: whitesmoke;
`;
const LoginContainer = styled.div`
  display: ${(props) => (!props.show ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  background-color: white;
  border-radius: 0.4rem;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;
const Logo = styled.img`
  height: 200px;
`;

const InputField = styled.input`
  margin: 1.5rem 0;
  padding: 0.8rem;
  width: 200px;
  font-size: 1rem;
`;

const Button = styled.button`
  margin-top: 0.8rem;
  width: 100px;
  cursor: pointer;
`;

const OtpContainer = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  background-color: white;
  border-radius: 0.4rem;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;
