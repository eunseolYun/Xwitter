import {
  collection,
  deleteDoc,
  limit,
  // getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Xweet from "./xweet";
import { Unsubscribe } from "firebase/auth";

export interface IXweet {
  id: string;
  xweet: string;
  username: string;
  userId: string;
  photo?: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
`;

export default function Timeline() {
  const [xweets, setXweets] = useState<IXweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchXweets = async () => {
      // query 생성
      const xweetsQuery = query(
        collection(db, "xweets"),
        orderBy("createdAt", "desc"),
        limit(20)
      );

      /* const snapshot = await getDocs(xweetsQuery);
            // query해온 data를 state에 저장
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
            }); */

      // eventListener 구독
      unsubscribe = await onSnapshot(xweetsQuery, (snapshot) => {
        const xweets = snapshot.docs.map((doc) => {
          const { xweet, userId, username, photo, createdAt } = doc.data();
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
      });
    };
    fetchXweets();

    // useEffect는 유저가 화면을 보지 않을 때(unmount) return하면서 cleanup 실행
    return () => {
      // unsubscribe가 참이라면(null이 아니면) unsubscribe를 실행
      unsubscribe && unsubscribe();
    };
  }, []);
  deleteDoc;

  return (
    <Wrapper>
      {xweets.map((xweet) => (
        <Xweet key={xweet.id} {...xweet} />
      ))}
    </Wrapper>
  );
}
