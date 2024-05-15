import styled from "styled-components";
import { ColorButton, Form, Input } from "../components/auth-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  font-size: 30px;
  color: ${(props) => props.color};
  border-bottom: 1px solid gray;
  padding: 20px 0px;
  margin-bottom: 8px;
`;

const RadioBtn = styled.div`
  display: flex;
  gap: 10px;
`;

const Switcher = styled.span`
  a {
    color: #1d9bf0;
  }
`;

export default function Setting() {
  const [theme, setTheme] = useState<string>("");

  const onChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    console.log("onChangePassword function clicked");
    alert("still work in progress... sorry :(");
  };

  const onThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    console.log("onThemeChange function clicked");
    setTheme(e.target.id);
  };

  useEffect(() => {
    // setState는 비동기작업이므로 useEffect를 사용해 state 변경 될때 작업 수행되도록 설정
    console.log(theme);
  }, [theme]);

  return (
    <Wrapper>
      <h1>STILL WORK IN PROGRESS...</h1>
      <Form property="short">
        <Header>theme</Header>
        <p>Choose how 𝕏witter looks to you.</p>
        <RadioBtn>
          {/* label 연결 필요 */}
          <input
            type="radio"
            id="light"
            name="theme"
            onChange={onThemeChange}
            checked={theme === "light"}
          ></input>
          <label htmlFor="light">
            <span>Light</span>
          </label>
        </RadioBtn>
        <RadioBtn>
          <input
            type="radio"
            id="dark"
            name="theme"
            onChange={onThemeChange}
            checked={theme === "dark"}
          ></input>
          <label htmlFor="dark">
            <span>dark</span>
          </label>
        </RadioBtn>
      </Form>

      <Form onSubmit={onChangePassword} property="short">
        <Header>change password</Header>
        <p>Make sure it's at least 6 characters.</p>
        <Input type="password" placeholder="old password"></Input>
        <Input type="password" placeholder="new password"></Input>
        <Input type="password" placeholder="confirm password"></Input>
        <ColorButton type="submit" color="var(--main-blue)" property="basic">
          update password
        </ColorButton>
        <Switcher>
          <Link to="/find-password">find password &rarr;</Link>
        </Switcher>
      </Form>

      <Form property="short">
        <Header color="var(--main-red)">delete account</Header>
        <p>
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <ColorButton color="var(--main-red)" property="basic">
          delete account
        </ColorButton>
      </Form>
    </Wrapper>
  );
}
