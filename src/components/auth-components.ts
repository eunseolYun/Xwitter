import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

export const Title = styled.h1`
  font-size: 42px;
`;

export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  &[property="short"] {
    margin-top: 10px;
    margin-bottom: 25px;
  }
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }
`;

export const ColorButton = styled.button`
  width: fit-content;
  background-color: ${(props) => props.color};
  color: var(--main-fontColor);
  border: 0;
  font-size: 12px;
  padding: 4px 6px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
  &[property="basic"] {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: var(--main-red);
`;

export const Switcher = styled.span`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  a {
    color: #1d9bf0;
  }
`;
