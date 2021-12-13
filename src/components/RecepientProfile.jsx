import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/fbconfig";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import getRecipientNumber from "../utils/getRecipientNumber";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";

const RecepientProfile = ({ id, chats, contacts, handleBackClick }) => {
  const [user] = useAuthState(auth);
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [pno, setPno] = useState("");
  const [newName, setNewName] = useState("");

  const updateFirebaseUser = () => {
    db.collection("users")
      .doc(user.uid)
      .update(
        {
          contacts: firebase.firestore.FieldValue.arrayRemove({
            name,
            pno,
          }),
        },
        { merge: true }
      )
      .then(() => {
        db.collection("users")
          .doc(user.uid)
          .update(
            {
              contacts: firebase.firestore.FieldValue.arrayUnion({
                name: newName,
                pno,
              }),
            },
            { merge: true }
          );
      })
      .catch((err) => console.log(err));
  };

  const handleNameUpdate = () => {
    setEditName(false);
    setLoading(true);
    updateFirebaseUser();
  };

  useEffect(() => {
    chats.forEach((chat) => {
      if (chat.id === id) {
        setPno(getRecipientNumber(chat.data().users, user));
      }
    });
  }, [chats, id, user]);

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("pno", "==", pno)
  );
  const recipient = recipientSnapshot?.docs?.[0].data();

  useEffect(() => {
    contacts.forEach((contact) => {
      if (contact.pno === pno) {
        setName(contact.name);
        setNewName(contact.name);
      }
    });
  }, [contacts, pno]);
  return (
    <Container>
      <Header>
        <IconButton
          style={{ backgroundColor: "transparent" }}
          onClick={handleBackClick}
        >
          <CloseIcon style={{ color: "whitesmoke" }} />
        </IconButton>
        <HeaderTitle>Contact info</HeaderTitle>
      </Header>
      <InfoContainer>
        <ProfilePic>
          {recipient?.photoURL ? (
            <img
              src={recipient?.photoURL}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/blank-profile-picture.webp";
              }}
              alt="Profile Pic"
            />
          ) : (
            <div>
              <p>{recipient?.name[0]}</p>
            </div>
          )}
        </ProfilePic>
        <UserDetails>
          <h2>{recipient?.name}</h2>
          <h3>{recipient?.pno}</h3>
        </UserDetails>
      </InfoContainer>
      <InfoContainer>
        <InfoTitle>Contact Name</InfoTitle>
        <InfoInput show={editName}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
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

export default RecepientProfile;

const Container = styled.div`
  flex: 0.35;
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
  margin: auto;
`;

const ProfilePic = styled.div`
  display: grid;
  place-items: center;
  margin-top: 1rem;
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
      font-size: 5rem;
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
  margin-bottom: 1rem;
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

const UserDetails = styled.div`
  text-align: center;

  > h2 {
    font-weight: 500;
    margin-bottom: 0.2rem;
    margin-top: 0.5rem;
    color: #353535;
  }
  > h3 {
    font-weight: 500;
    margin-top: 0;
    color: #585858;
  }
`;
