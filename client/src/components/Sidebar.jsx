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

const Sidebar = () => {
  const [button, setButton] = useState("Conversations");
  const [showModal, setShowModal] = useState(false);

  const handleModalClick = (e) => {
    e.preventDefault();
    setShowModal(!showModal);
  };

  const handleLogoutClick = () => {
    console.log("clicked");
    auth.signOut();
  };
  return (
    <Container>
      <Top>
        <Header>
          <UseAvatar onClick={handleLogoutClick} />
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
            className={button === "Conversations" ? "active" : ""}
            onClick={() => setButton("Conversations")}
          >
            Conversations
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
        {[...Array(20)].map((chat) => (
          <Chat />
        ))}
      </ChatsContainer>
      <CreateButton onClick={handleModalClick}>
        {button === "Conversations"
          ? "Start a new Conversation"
          : "Add a new Contact"}
      </CreateButton>
      <Modal status={showModal}>
        {button === "Conversations" ? (
          <ConversationsModal closeModal={handleModalClick} />
        ) : (
          <ContactsModal closeModal={handleModalClick} />
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
