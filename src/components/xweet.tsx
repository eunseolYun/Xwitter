import styled from "styled-components";
import { IXweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
`;

const Column = styled.div``;

const Row = styled.div`
    display: flex;
    gap: 5px;
    align-items: start;
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
    border-radius: 15px;
`;

const DeleteButton = styled.button`
    background-color: var(--main-red);
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 8px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

const EditButton = styled.button`
    background-color: var(--main-blue);
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 8px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

export default function Xweet({
    username,
    photo,
    xweet,
    userId,
    id,
    createdAt,
}: IXweet) {
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

    const onEdit = async () => {
        if (user?.uid !== userId) return;
        try {
            // data 가져오기
            // form에 띄우기
            // 수정된 data update
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Wrapper>
            <Column>
                <Row>
                    <Username>{username}</Username>
                    <Time>
                        {month}.{day} {hour}:{min}
                    </Time>
                </Row>
                <Payload>{xweet}</Payload>
                {user?.uid === userId ? (
                    <Row>
                        <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                        <EditButton onClick={onEdit}>Edit</EditButton>
                    </Row>
                ) : null}
            </Column>
            {photo ? (
                <Column>
                    <Photo src={photo} />
                </Column>
            ) : null}
        </Wrapper>
    );
}
