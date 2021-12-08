import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../config/fbconfig";
import firebase from "firebase";

const ContactsModal = ({
  closeModal,
  recipientNumber,
  recipientName,
  contacts,
}) => {
  const [user] = useAuthState(auth);
  const [err, setErr] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [name, setName] = useState("");
  const [pno, setPno] = useState("+91");

  const reset = (e) => {
    setName("");
    setPno("+91");
    setIsValid(true);
    closeModal(e);
  };

  const useUserRef = db.collection("users").where("pno", "==", pno);
  const [usersSnapshot] = useCollection(useUserRef);
  const checkNumber = (pnoEntered) => {
    setIsValid(true);
    if (pnoEntered.substring(0, 3) !== "+91") {
      setErr("Number should begin with +91");
      setIsValid(false);
    } else {
      setPno(pnoEntered.split(" ").join(""));
    }
  };

  const addToContactHandler = (e) => {
    e.preventDefault();
    if (pno === user.phoneNumber) {
      setErr("Can't add your number as a contact");
      setIsValid(false);
    } else if (pno === "+91") {
      setErr("Please enter a valid phone number");
      setIsValid(false);
    } else if (usersSnapshot.docs.length === 0) {
      setErr("User does not exist!");
      setIsValid(false);
    } else if (contacts?.includes(pno)) {
      setErr("User already exists in contacts");
      setIsValid(false);
    } else {
      let contact = {
        pno,
        name: name === "" ? usersSnapshot?.docs[0].data().name : name,
      };
      setErr("");
      setIsValid(true);
      db.collection("users")
        .doc(user.uid)
        .update({
          contacts: firebase.firestore.FieldValue.arrayUnion(contact),
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
    console.log("useEffect ran");
    recipientName ? setName(recipientName) : setName("");
    recipientNumber ? setPno(recipientNumber) : setName("+91");
  }, [recipientName, recipientNumber]);

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
          <label htmlFor="text">Name (optional)</label>
          <input text value={name} onChange={(e) => setName(e.target.value)} />
          <label htmlFor="text">Phone Number</label>
          <InputField
            text
            required
            value={pno}
            onChange={(e) => checkNumber(e.target.value)}
            isValid={isValid}
            autoFocus={true}
          />
          {!isValid && <div>{err}</div>}
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
      &:focus {
        border: 1px solid #3cbc28;
      }
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

    > div {
      color: red;
    }
  }
`;

const InputField = styled.input`
  padding: 0.5rem;
  border: 1px solid #e2e2e2;
  border-radius: 0.2rem;
  margin-bottom: 1rem;
  outline: none;
  font-size: 1rem;
  &:focus {
    border: ${(props) =>
      props.isValid ? "1px solid #3cbc28" : "1px solid red"};
  }
`;
