import { useState } from "react";
import styled from "styled-components";
import MathSession from "./components/MathSession";

const Container = styled.div`
  height: 100vh;
`;

export default function App() {
  const [inSession, setInSession] = useState(true);

  function handleFinish() {
    setInSession(false);
    alert("Finished!");
  }

  return (
    <Container>
      {inSession && (
        <MathSession
          onFinish={handleFinish}
          options={{
            amount: 10,
            op: "*",
            type: "matrix",
          }}
        />
      )}
    </Container>
  );
}
