import styled from "styled-components";
import PostXweetForm from "../components/post-xweet-form";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
  /* grid-template-rows: 1fr 5fr; */
  /* border-right: 1px solid gray; */
  /* border-left: 1px solid gray; */
  padding: 50px 0px 30px;
`;

export default function Home() {
  return (
    <Wrapper>
      <PostXweetForm />
      <Timeline />
    </Wrapper>
  );
}
