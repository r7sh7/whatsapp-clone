import React, { useState } from "react";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/fbconfig";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

const UserProfile = ({ handleBackClick }) => {
  const [user] = useAuthState(auth);
  const [editURL, setEditURL] = useState(false);
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(user.displayName);
  const [dp, setDp] = useState(user.photoURL);
  const [loading, setLoading] = useState(false);

  const updateFirebaseUser = (value) => {
    const currentUser = auth.currentUser;
    if (value === "name") {
      currentUser
        .updateProfile({
          displayName: name,
        })
        .then(() => {
          db.collection("users")
            .doc(user.uid)
            .set(
              {
                name: user.displayName,
              },
              { merge: true }
            )
            .then(() => setLoading(false));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      currentUser
        .updateProfile({
          photoURL: dp,
        })
        .then(() => {
          db.collection("users")
            .doc(user.uid)
            .set(
              {
                photoURL: user.photoURL,
              },
              { merge: true }
            )
            .then(() => setLoading(false));
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  const handleNameUpdate = () => {
    setEditName(false);
    setLoading(true);
    updateFirebaseUser("name");
  };

  const handleURLUpdate = () => {
    setEditURL(false);
    setLoading(true);
    updateFirebaseUser("Dp");
  };
  return (
    <Container>
      <Header>
        <IconButton
          style={{ backgroundColor: "transparent" }}
          onClick={handleBackClick}
        >
          <ArrowBackIcon style={{ color: "whitesmoke" }} />
        </IconButton>
        <HeaderTitle> Profile</HeaderTitle>
      </Header>
      <ProfilePic>
        {user.photoURL ? (
          <img src={user.photoURL} alt="Profile Pic" />
        ) : (
          <div>
            <p>No Profile Picture Chosen</p>
          </div>
        )}
      </ProfilePic>
      <InfoContainer>
        <InfoTitle>Profile Pic URL</InfoTitle>

        {editURL ? (
          <InfoInput show={editURL}>
            <input
              type="text"
              value={dp}
              onChange={(e) => setDp(e.target.value)}
            />
            <IconButton onClick={handleURLUpdate}>
              <CheckIcon />
            </IconButton>
          </InfoInput>
        ) : (
          <InfoInput show={editURL}>
            {dp ? (
              <input type="text" value={dp} disabled />
            ) : (
              <input type="text" value="-" disabled />
            )}
            <IconButton onClick={() => setEditURL(true)}>
              <EditIcon />
            </IconButton>
          </InfoInput>
        )}
      </InfoContainer>
      <ProfilePic>
        <p>
          Please Enter a valid URL (ending with .jpg, jpeg, png) to update your
          profile picture.
        </p>
      </ProfilePic>
      <InfoContainer>
        <InfoTitle>Your Name</InfoTitle>
        <InfoInput show={editName}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editName}
            autoFocus
          />
          {editName ? (
            <IconButton onClick={handleNameUpdate}>
              <CheckIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => setEditName(true)}>
              <EditIcon />
            </IconButton>
          )}
        </InfoInput>
      </InfoContainer>
    </Container>
  );
};

export default UserProfile;

const Container = styled.div`
  flex: 0.3;
  height: 100vh;
  min-width: 300px;
  border-right: 1px solid #e2e2e2;
  background-color: #ebebeb;
`;

const Header = styled.div`
  background-color: #53a384;
  padding: 1rem;
  display: flex;
`;
const HeaderTitle = styled.h3`
  color: whitesmoke;
  font-weight: 500;
  text-align: center;
  margin-left: 8rem;
`;

const ProfilePic = styled.div`
  display: grid;
  place-items: center;
  margin: 2rem;

  > img {
    height: 12rem;
    width: 12rem;
    border-radius: 50%;
    object-fit: cover;
  }

  > div {
    height: 12rem;
    width: 12rem;
    border-radius: 50%;
    border: 1px solid #e2e2e2;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #bebebe;

    > p {
      text-align: center;
      color: whitesmoke;
      font-size: 1.4rem;
    }
  }

  > p {
    color: #8d8a8a;
    font-weight: 500;
  }
`;

const InfoContainer = styled.div`
  background-color: white;
  border: 1px solid #e2e2e2;
  padding: 0 2rem;
`;

const InfoTitle = styled.p`
  color: #53a384;
  font-size: 1rem;
  font-weight: 500;
`;

const InfoInput = styled.div`
  display: flex;
  border-bottom: ${(props) => (props.show ? "2px solid #53a384" : "none")};
  margin-bottom: 0.5rem;
  > input {
    flex: 1;
    outline: none;
    border: none;
    font-size: 1.2rem;
    :disabled {
      color: black;
    }
  }
`;
