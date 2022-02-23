import React from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

const Hamburger = () => {
  const [open, setOpen] = React.useState(false);
  const node = React.useRef();
  return (
    <div>
      <div ref={node}>
        <Burger open={open} setOpen={setOpen} />
        <Menu open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};
const Menu = ({ open, setOpen }) => {
  const history = useHistory();
  return (
    <StyledMenu open={open}>
      <div style={{ height: "5rem", width: "15rem" }}>
        <img
          style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
          src="https://res.cloudinary.com/skdtech/image/upload/v1645601951/ins_logo_zbll70.png"
          alt=""
        />
      </div>
      <Link to="/home">
        <div
          onClick={() => {
            setOpen(!open);
          }}
        >
          Home
        </div>
      </Link>
      <Link to="/profile">
        <div
          onClick={() => {
            setOpen(!open);
          }}
        >
          Profile
        </div>
      </Link>
      <Link to="/favorites">
        <div
          onClick={() => {
            setOpen(!open);
          }}
        >
          Favorites
        </div>
      </Link>

      <div
        onClick={() => {
          setOpen(!open);
          localStorage.clear();
          history.push("/");
        }}
      >
        Logout
      </div>
    </StyledMenu>
  );
};

const StyledMenu = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #effffa;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  height: 100vh;
  text-align: left;
  padding: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;
  @media (max-width: 576px) {
    width: 100%;
  }
  div {
    font-size: 2rem;
    text-transform: uppercase;
    padding: 2rem 0;
    font-weight: bold;
    letter-spacing: 0.5rem;
    color: #0d0c1d;
    text-decoration: none;
    transition: color 0.3s linear;
    @media (max-width: 576px) {
      font-size: 1.5rem;
      text-align: center;
    }
    &:hover {
      color: #343078;
    }
  }
`;

const StyledBurger = styled.button`
  position: absolute;
  top: 2.5%;
  left: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 1rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  &:focus {
    outline: none;
  }
  div {
    width: 2rem;
    height: 0.25rem;
    background: ${({ open }) => (open ? "#0D0C1D" : "grey")};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
    :first-child {
      transform: ${({ open }) => (open ? "rotate(45deg)" : "rotate(0)")};
    }
    :nth-child(2) {
      opacity: ${({ open }) => (open ? "0" : "1")};
      transform: ${({ open }) => (open ? "translateX(20px)" : "translateX(0)")};
    }
    :nth-child(3) {
      transform: ${({ open }) => (open ? "rotate(-45deg)" : "rotate(0)")};
    }
  }
  @media (min-width: 768px) {
    display: none;
  }
`;

const Burger = ({ open, setOpen }) => {
  return (
    <StyledBurger open={open} onClick={() => setOpen(!open)}>
      <div />
      <div />
      <div />
    </StyledBurger>
  );
};
export default Hamburger;
