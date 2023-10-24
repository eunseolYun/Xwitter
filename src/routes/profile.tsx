import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { IXweet } from "../components/timeline";
import Xweet from "../components/xweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: var(--main-blue);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 5px;
  height: 40px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Xweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const EditButton = styled.button`
  background-color: var(--main-bgColor);
  color: var(--main-fontColor);
  border: none;
  width: 20px;
  height: 20px;
  padding: 0px;
  border-radius: 50%;
  cursor: pointer;
`;

const RedButton = styled.button`
  background-color: var(--main-red);
  color: var(--main-fontColor);
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 8px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const BlueButton = styled.button`
  background-color: var(--main-blue);
  color: var(--main-fontColor);
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 8px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const NameInput = styled.input`
  background-color: var(--main-bgcolor);
  border: 2px solid white;
  height: 36px;
  width: 130px;
  border-radius: 8px;
  padding: 0 10px;
  color: var(--main-fontColor);
  font-size: 18px;
  &:focus {
    outline: none;
    border: 2px solid var(--main-blue);
  }
`;

export default function Profile() {
  const user = auth.currentUser;
  const displayName = user?.displayName;

  const [avatar, setAvatar] = useState(user?.photoURL);
  const [xweets, setXweets] = useState<IXweet[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(displayName ?? "Anonymous");

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return; // Typescript에게 user의 존재 확인시킴
    if (files && files.length === 1) {
      const file = files[0];
      if (file.size > 1024 * 1024) {
        return alert("Allow images less than 1MB only");
      }
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const onEditName = () => {
    if (!user) return;
    setIsEditing(true);
  };

  const onSaveName = async () => {
    if (!user) return;
    if (!name) {
      alert("please write your nickname");
      return;
    }
    // input name 받아서 updateProfile하고 편집모드false
    await updateProfile(user, {
      displayName: name,
    });
    setIsEditing(false);
  };

  const onCancelName = () => {
    setIsEditing(false);
    setName(displayName ?? "Anonymous");
  };

  const fetchXweets = async () => {
    // Xweets timeline 불러오기와 비슷
    // query 생성해서 데이터 가져오기
    const xweetQuery = query(
      collection(db, "xweets"),
      where("userId", "==", user?.uid), // filter 역할
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const snapshot = await getDocs(xweetQuery);
    const xweets = snapshot.docs.map((doc) => {
      const { xweet, createdAt, userId, username, photo } = doc.data();
      return {
        id: doc.id,
        xweet,
        userId,
        username,
        photo,
        createdAt,
      };
    });
    setXweets(xweets);
  };
  useEffect(() => {
    fetchXweets();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {!!avatar ? (
          // 아바타 이미지 있으면 이미지 표시
          <AvatarImg src={avatar} />
        ) : (
          // 아바타 이미지 없으면 svg 표시
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {isEditing ? (
        // name 편집중
        <Name>
          <NameInput
            onChange={(e) => setName(e.target.value)}
            placeholder="Nickname"
            value={name}
            required
          />
          <BlueButton onClick={onSaveName}>Save</BlueButton>
          <RedButton onClick={onCancelName}>Cancel</RedButton>
        </Name>
      ) : (
        // name 표시중
        <Name>
          {user?.displayName ?? "Anonymous"}
          <EditButton onClick={onEditName}>
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
          </EditButton>
        </Name>
      )}
      <Xweets>
        {xweets.map((xweet) => (
          <Xweet key={xweet.id} {...xweet} />
        ))}
      </Xweets>
    </Wrapper>
  );
}
