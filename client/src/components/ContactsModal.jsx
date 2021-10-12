import React, { useState } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../config/fbconfig";

const ContactsModal = ({ closeModal }) => {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [pno, setPno] = useState("+91");

  const reset = (e) => {
    setName("");
    setPno("+91");
    closeModal(e);
  };

  const addToContactHandler = () => {
    if (pno !== user.phoneNumber && !chatAlreadyExists(pno)) {
      db.collection("chats").add({
        users: [user.phoneNumber, pno],
      });
    }
  };

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.phoneNumber);
  const [chatsSnapshot] = useCollection(userChatRef);

  const chatAlreadyExists = (pno) =>
    !!chatsSnapshot?.docs.find(
      (chat) => chat.data().users.find((user) => user === pno)?.length > 0
    );

  return (
    <Card>
      <Header>
        <h2>Create Contact</h2>
        <IconButton onClick={reset}>
          <CloseIcon />
        </IconButton>
      </Header>
      <Body>
        <form onSubmit={addToContactHandler}>
          <label htmlFor="text">Name</label>
          <input
            text
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="text">Phone Number</label>
          <input
            text
            required
            value={pno}
            onChange={(e) => setPno(e.target.value)}
          />
          <button>Submit</button>
        </form>
      </Body>
    </Card>
  );
};

export default ContactsModal;

const Card = styled.div`
  max-width: 35rem;
  width: 100%;
  border-radius: 0.4rem;
  background-color: whitesmoke;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e2e2e2;
`;

const Body = styled.div`
  padding: 1rem;

  > form {
    display: flex;
    flex-direction: column;

    > label {
      font-size: 1.2rem;
      padding: 0.5rem 0;
    }

    > input {
      padding: 0.5rem;
      border: 1px solid #e2e2e2;
      border-radius: 0.2rem;
      margin-bottom: 1rem;
      outline: none;
      font-size: 1rem;
    }

    > button {
      max-width: 8rem;
      padding: 0.8rem;
      margin-top: 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: whitesmoke;
      background-color: #3cbc28;
      border: 1px solid #e2e2e2;
      border-radius: 0.2rem;
    }
  }
`;
