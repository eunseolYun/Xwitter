import styled from "styled-components";
import PostXweetForm from "../components/post-xweet-form";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 30px;
  overflow-y: scroll;
  /* grid-template-rows: 1fr 5fr; */
`;

export default function Home() {
  return (
    <Wrapper>
      <PostXweetForm />
      <Timeline />
    </Wrapper>
  );
}
