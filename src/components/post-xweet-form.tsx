import styled from "styled-components";
import "../variables.css";
import React, { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 20px;
  border-top: 1px solid gray;
`;

const TextArea = styled.textarea`
  border: none;
  padding: 15px;
  font-size: 16px;
  color: var(--main-fontColor);
  background-color: var(--main-bgColor);
  width: 100%;
  resize: none;
  &::placeholder {
    font-size: 16px;
    font-family: inherit;
  }
  &:focus {
    outline: none;
    border-color: var(--main-blue);
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AttachFileButton = styled.label`
  padding: 10px 15px;
  color: var(--main-blue);
  text-align: center;
  border-radius: 20px;
  border: 1px solid var(--main-blue);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: var(--main-blue);
  color: var(--main-fontColor);
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostXweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [xweet, setXweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setXweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    // codeChallenge: 1MB 미만의 파일로 제한하기 ✅
    if (files && files.length === 1) {
      if (files[0].size > 1024 * 1024) {
        return alert("Allow images less than 1MB only");
      }
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || xweet === "" || xweet.length > 180) return;

    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "xweets"), {
        //data
        xweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        // check for deleting xweet.
        // user(who want to delete) === xweet writer
        userId: user.uid,
      });
      console.log(user.uid);

      if (file) {
        const locationRef = ref(storage, `xweets/${user.uid}/${doc.id}`);
        // file 저장할 storage 위치 정하기
        console.log(locationRef);
        const result = await uploadBytes(locationRef, file); // file 저장
        console.log(result); // 에러 위치!!
        const url = await getDownloadURL(result.ref); // upload된 file Url 주소 다운
        await updateDoc(doc, {
          // file Url을 firestore(database)에 저장
          photo: url,
        });
      }
      setXweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        onChange={onChange}
        rows={5}
        maxLength={180}
        placeholder="What is happening?"
        value={xweet}
        required
      />
      <Buttons>
        <AttachFileButton htmlFor="file">
          {file ? `${file.name}✅` : "Add photo"}
        </AttachFileButton>
        <AttachFileInput
          onChange={onFileChange}
          type="file"
          id="file"
          accept="image/*"
        />
        <SubmitBtn
          type="submit"
          value={isLoading ? "Posting..." : "Post Xweet"}
        />
      </Buttons>
    </Form>
  );
}
