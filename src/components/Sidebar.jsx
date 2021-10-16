import React, { useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import Chat from "./Chat";
import ConversationsModal from "./ConversationsModal";
import ContactsModal from "./ContactsModal";
import { auth } from "../config/fbconfig";
import Contact from "./Contact";
import { useHistory } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";

const Sidebar = ({ id, chats, contacts }) => {
  const [button, setButton] = useState("Chats");
  const [showModal, setShowModal] = useState(false);
  const [user] = useAuthState(auth);
  const history = useHistory();

  const handleModalClick = (e) => {
    e.preventDefault();
    setShowModal(!showModal);
  };

  const handleLogoutClick = () => {
    history.push("/");
    auth.signOut();
  };

  return (
    <Container>
      <Top>
        <Header>
          {user?.photoURL ? (
            <UseAvatar onClick={handleLogoutClick} src={user.photoURL} />
          ) : (
            <UseAvatar onClick={handleLogoutClick}>
              {user?.displayName[0]}
            </UseAvatar>
          )}
          <HeaderIcons>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </HeaderIcons>
        </Header>
        <Search>
          <SearchBar>
            <SearchIcon />
            <input placeholder="Search in chats" />
          </SearchBar>
        </Search>
        <TabWrapper>
          <button
            className={button === "Chats" ? "active" : ""}
            onClick={() => setButton("Chats")}
          >
            Chats
          </button>
          <button
            className={button === "Contacts" ? "active" : ""}
            onClick={() => setButton("Contacts")}
          >
            Contacts
          </button>
        </TabWrapper>
      </Top>
      <ChatsContainer>
        {button === "Chats" ? (
          chats.length === 0 ? (
            <ContactsContainer>You have no chats</ContactsContainer>
          ) : (
            chats.map((chat) => {
              return (
                <Chat
                  key={chat.id}
                  id={chat.id}
                  users={chat.data().users}
                  active={id === chat.id ? true : false}
                  contacts={contacts}
                />
              );
            })
          )
        ) : contacts.length === 0 ? (
          <ContactsContainer>You have no contacts</ContactsContainer>
        ) : (
          contacts?.map((contact) => (
            <Contact contact={contact} key={contact.pno} />
          ))
        )}
      </ChatsContainer>
      <CreateButton onClick={handleModalClick}>
        {button === "Chats" ? "Create a Group Chat" : "Add a new Contact"}
      </CreateButton>
      <Modal status={showModal}>
        {button === "Chats"
          ? showModal && <ConversationsModal closeModal={handleModalClick} />
          : showModal && (
              <ContactsModal
                closeModal={handleModalClick}
                recipientName=""
                recipientNumber="+91"
              />
            )}
      </Modal>
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  height: 100vh;
  min-width: 350px;
  max-width: 400px;
  border-right: 1px solid #e2e2e2;
`;

const Top = styled.div`
  position: sticky;
  top: 0;
  z-index: 99;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ebebeb;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid whitesmoke;
`;

const UseAvatar = styled(Avatar)`
  cursor: pointer;
`;

const HeaderIcons = styled.div`
  color: #424242;
`;

const Search = styled.div`
  background-color: whitesmoke;
  padding: 0.4rem 1rem;
  border-bottom: 1px solid whitesmoke;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0.4rem 1rem;
  border: 1px solid whitesmoke;
  border-radius: 1.5rem;

  > input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    margin-left: 1rem;
  }
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  > button {
    width: 50%;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    color: gray;

    &.active {
      color: black;
      font-size: 1.2rem;
      border-bottom: 3px solid #0a0a0a;
    }
  }
`;

const ChatsContainer = styled.div`
  height: 70vh;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  --ms-overflow-style: none;
  scrollbar-width: none;
`;

const CreateButton = styled.button`
  width: 100%;
  position: sticky;
  bottom: 0;
  padding: 1.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
`;

const Modal = styled.div`
  position: fixed;
  display: ${(props) => (props.status ? "grid" : "none")};
  place-items: center;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.6);
`;

const ContactsContainer = styled.div`
  display: grid;
  place-items: center;
  height: 100%;
`;