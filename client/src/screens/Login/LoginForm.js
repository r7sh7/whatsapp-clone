import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import styled from "styled-components";
import { auth } from "../../config/fbconfig";
import { login } from "../../store/actions/authActions";

const LoginForm = () => {
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  const handleClick = () => {
    const user = auth.currentUser;
    user
      .updateProfile({
        displayName: name,
        photoURL: photoURL,
      })
      .then(() => {
        dispatch(login(user));
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!user) {
      history.push("/login");
    } else if (user.name) {
      history.push("/");
    }
  }, [history, user]);

  if (!user) <Redirect to="/login" />;
  return (
    <Container>
      <LoginContainer>
        <h2>Login Form</h2>
        <Logo src="/images/logo.svg" />
        <InputField
          placeholder="Enter Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          placeholder="Enter Photo URL"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
        />
        <Button onClick={handleClick}>Next</Button>
      </LoginContainer>
      ;
    </Container>
  );
};

export default LoginForm;

const Container = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  background-color: whitesmoke;
`;
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  background-color: white;
  border-radius: 0.4rem;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Button = styled.button`
  margin-top: 0.8rem;
  width: 100px;
  cursor: pointer;
`;

const InputField = styled.input`
  margin: 1.5rem 0;
  padding: 0.8rem;
  width: 200px;
  font-size: 1rem;
`;

const Logo = styled.img`
  height: 200px;
`;
