import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../config/fbconfig";
import firebase from "firebase";

const ContactsModal = ({ closeModal, recipientNumber, recipientName }) => {
  console.log("component mounted");
  const [user] = useAuthState(auth);
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [pno, setPno] = useState("+91");

  const reset = (e) => {
    setName("");
    setPno("+91");
    closeModal(e);
  };

  const checkNumber = (pnoEntered) => {
    if (pnoEntered.substring(0, 3) !== "+91") {
      setErr("Number should begin with +91");
      console.log(err);
    } else {
      setPno(pnoEntered.split(" ").join(""));
    }
  };
  console.log(pno);
  const useUserRef = db.collection("users").where("pno", "==", pno);
  const [usersSnapshot] = useCollection(useUserRef);
  const addToContactHandler = (e) => {
    e.preventDefault();
    if (pno === user.phoneNumber) {
      setErr("Can't add your number as a contact");
      console.log(err);
    } else if (usersSnapshot.docs.length === 0) {
      setErr("User does not exist!");
      console.log(err);
    } else {
      db.collection("users")
        .doc(user.uid)
        .update({
          contacts: firebase.firestore.FieldValue.arrayUnion({ pno, name }),
        })
        .then(() => {
          db.collection("users")
            .doc(user.uid)
            .get()
            .then((doc) => {
              console.log(doc.data());
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
        });
      reset(e);
    }
  };

  useEffect(() => {
    recipientName ? setName(recipientName) : setName("");
    recipientNumber ? setPno(recipientNumber) : setName("+91");
  }, [recipientName, recipientNumber]);

  console.log(name);
  console.log(pno);
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
          <input text value={name} onChange={(e) => setName(e.target.value)} />
          <label htmlFor="text">Phone Number</label>
          <input
            text
            required
            value={pno}
            onChange={(e) => checkNumber(e.target.value)}
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
