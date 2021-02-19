import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  ArithmeticQuestion,
  MathPractice,
  MathSession as MathSessionType,
  MathSessionOption,
  Matrix,
  MatrixQuestion,
  Util,
} from "../math";
import {
  MatrixDisplay,
  MatrixInput,
  matrixToNullableMatrix,
  NullableMatrix,
} from "./Matrix";

const MathSessionContainer = styled.div`
  font-size: 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Spacer = styled.div`
  position: inline;
  width: 0.25rem;
`;

type MathSessionProps = {
  options: MathSessionOption;
  onFinish: () => void;
};

export default function MathSession(props: MathSessionProps) {
  const [session] = useState(() => MathPractice.newMathSession(props.options));
  if (session.type === "arithmetic") {
    return <ArithmeticSession session={session} onFinish={props.onFinish} />;
  } else {
    return <MatrixSession session={session} onFinish={props.onFinish} />;
  }
}

type ArithmeticSessionProps = {
  session: MathSessionType;
  onFinish: () => void;
};

function ArithmeticSession(props: ArithmeticSessionProps) {
  const question = props.session.questions[
    props.session.currentQuestion
  ] as ArithmeticQuestion;
  return <MathSessionContainer></MathSessionContainer>;
}

type MatrixSessionProps = {
  session: MathSessionType;
  onFinish: () => void;
};

function MatrixSession(props: MatrixSessionProps) {
  const question = props.session.questions[
    props.session.currentQuestion
  ] as MatrixQuestion;
  const [input, setInput] = useState(() =>
    matrixToNullableMatrix(question.ans)
  );

  function handleInputChange(matrix: NullableMatrix) {
    if (Util.matrix.cmp(matrix as Matrix, question.ans)) {
      // Set timeout to delay slightly
      setTimeout(() => {
        props.session.currentQuestion++;
        if (props.session.currentQuestion === props.session.questions.length) {
          props.onFinish();
        } else {
          const question = props.session.questions[
            props.session.currentQuestion
          ] as MatrixQuestion;
          setInput(matrixToNullableMatrix(question.ans));
        }
      }, 250);
    }
    setInput(matrix);
  }

  return (
    <MathSessionContainer>
      <MatrixDisplay matrix={question.mat1} />
      <Spacer />
      <MatrixDisplay matrix={question.mat2} />
      <Spacer />
      <p> = </p>
      <Spacer />
      <MatrixInput
        questionNum={props.session.currentQuestion}
        matrix={input}
        onChange={handleInputChange}
      />
    </MathSessionContainer>
  );
}
