import styled from "styled-components";
import { IXweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { ColorButton } from "./auth-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 4fr;
  padding: 20px;
  border: none;
  border-top: 1px solid gray;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  gap: 8px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Time = styled.span`
  font-weight: 300;
  font-size: 12px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  /* border: 1px solid white; */
  border: none;
  border-left: 1px solid gray;
  padding: 10px;
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

const AttachFileButton = styled.label`
  padding: 10px 0;
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

const Buttons = styled.div`
  display: flex;
  gap: 5px;
`;

export default function Xweet({
  username,
  photo,
  xweet,
  userId,
  id,
  createdAt,
}: IXweet) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedXweet, setEditedXweet] = useState(xweet);
  const [editedFile, setEditedFile] = useState<File | null>(null);

  const user = auth.currentUser;

  // 작성시간 the time that created xweet ✅
  const date: Date = new Date(createdAt);
  const month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes();

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      // firestore에서 xweet찾아 삭제
      await deleteDoc(doc(db, "xweets", id));
      if (photo) {
        const photoRef = ref(storage, `xweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const onEdit = () => {
    if (user?.uid !== userId) return;
    setIsEditing(true);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > 1024 * 1024) {
        return alert("Allow images less than 1MB only");
      }
      setEditedFile(files[0]);
    }
  };

  const onSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || xweet === "" || xweet.length > 180) return;

    try {
      setIsLoading(true);
      await updateDoc(doc(db, "xweets", id), { xweet: editedXweet });

      if (editedFile) {
        const locationRef = ref(storage, `xweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, editedFile);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "xweets", id), {
          photo: url,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setEditedXweet(xweet);
  };

  return (
    <Wrapper>
      <Row>
        <Username>{username}</Username>
        <Time>
          {month}.{day} {hour}:{min}
        </Time>
      </Row>
      <Row>
        {isEditing ? (
          // edit중일 때 Form과 Cancel, Save 버튼
          <>
            <Form onSubmit={onSaveEdit}>
              <TextArea
                onChange={(e) => setEditedXweet(e.target.value)}
                rows={3}
                maxLength={180}
                placeholder="What is happening?!"
                value={editedXweet}
                required
              />
              <AttachFileButton htmlFor="editedFile">
                {editedFile ? `${editedFile.name}✅` : "Add photo"}
              </AttachFileButton>
              <AttachFileInput
                onChange={onFileChange}
                type="file"
                id="editedFile"
                accept="image/*"
              />
              <Buttons>
                <ColorButton onClick={onCancelEdit} color="var(--main-red)">
                  Cancel
                </ColorButton>
                <ColorButton type="submit" color="var(--main-blue)">
                  {isLoading ? "Posting..." : "Save"}
                </ColorButton>
              </Buttons>
            </Form>
          </>
        ) : (
          // edit중이 아닐 때 payload, photo와 Delete,Edit 버튼
          <>
            <Column>
              <Payload>{xweet}</Payload>
              {user?.uid === userId ? (
                <Buttons>
                  <ColorButton onClick={onDelete} color="var(--main-red)">
                    Delete
                  </ColorButton>
                  <ColorButton onClick={onEdit} color="var(--main-blue)">
                    Edit
                  </ColorButton>
                </Buttons>
              ) : null}
            </Column>
            {photo ? (
              <Column>
                <Photo src={photo} />
              </Column>
            ) : null}
          </>
        )}
      </Row>
    </Wrapper>
  );
}
