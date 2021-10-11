import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import firebase from "firebase";
import { auth, db } from "../../config/fbconfig";
import { Redirect, useHistory } from "react-router";
import { login } from "../../store/actions/authActions";

const LoginScreen = () => {
  const [pno, setPno] = useState("+91 ");
  const [otp, setOtp] = useState("");
  const [show, setShow] = useState(false);
  const [result, setResult] = useState();

  const dispatch = useDispatch();
  const history = useHistory();

  const getOtp = (e) => {
    e.preventDefault();
    console.log(pno);
    if (pno === "" || pno.length < 10) return;
    let verify = new firebase.auth.RecaptchaVerifier("recaptcha-container");
    auth
      .signInWithPhoneNumber(pno, verify)
      .then((result) => {
        console.log(result);
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
        dispatch(login(userAuth.user));
        if (
          userAuth.user.metadata.creationTime ===
          userAuth.user.metadata.lastSignInTime
        ) {
          history.push("/loginform");
        } else {
          history.push("/");
        }
      })
      .catch((err) => {
        alert("Wrong code");
      });
  };

  const user = useSelector((state) => state.auth.user);

  if (user) return <Redirect to="/" />;
  return (
    <Container>
      <LoginContainer show={show}>
        <h1>Welcome to the WhatsApp Clone!</h1>
        <Logo src="/images/logo.svg" />
        <InputField
          placeholder="Enter your phone number"
          value={pno}
          onChange={(e) => setPno(e.target.value)}
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
