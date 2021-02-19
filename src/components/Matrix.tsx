import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Matrix, Util } from "../math";

const MatrixLeftBracket = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1rem;
  border-top: 0.25rem solid black;
  border-bottom: 0.25rem solid black;
  border-left: 0.25rem solid black;
  left: 0;
`;
const MatrixRightBracket = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1rem;
  border-top: 0.25rem solid black;
  border-bottom: 0.25rem solid black;
  border-right: 0.25rem solid black;
  right: 0;
`;
const Input = styled.input`
  text-align: center;
  width: 4rem;
`;
const InputReadonly = styled.input`
  text-align: center;
  width: 4rem;
  border: none;
  &:focus {
    border: none;
  }
`;

const MatrixContainer = styled.div`
  position: relative;
  display: inline-block;
  padding: 0.25rem;
`;

export type NullableMatrix = (number | null)[][];

export function matrixToNullableMatrix(matrix: Matrix): NullableMatrix {
  return matrix.map((col) => col.map((x) => null));
}

type MatrixInputProps = {
  questionNum: number;
  matrix: NullableMatrix;
  onChange: (matrix: NullableMatrix) => void;
};

export function MatrixInput(props: MatrixInputProps) {
  const width = props.matrix.length;
  const height = props.matrix[0].length;
  function handleMatrixInput(x: number, y: number, text: string) {
    let val: number | null = parseFloat(text);
    if (isNaN(val)) {
      val = null;
    }
    props.onChange(
      props.matrix.map((col, i) =>
        i === x ? col.map((cell, j) => (j === y ? val : cell)) : col
      )
    );
  }

  const divRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<HTMLInputElement[][]>([]);
  useEffect(() => {
    inputRefs.current[0][0].focus();
  }, [props.questionNum]);
  useEffect(() => {
    const div = divRef.current;
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        let next = false;
        for (let j = 0; j < height; j++) {
          for (let i = 0; i < width; i++) {
            if (next) {
              inputRefs.current[i][j].focus();
              return;
            }
            if (document.activeElement === inputRefs.current[i][j]) {
              next = true;
            }
          }
        }
        if (next) {
          inputRefs.current[0][0].focus();
        }
      }
    };
    div?.addEventListener("keydown", handleKeydown);
    return () => div?.removeEventListener("keydown", handleKeydown);
  }, [width, height]);

  return (
    <MatrixContainer ref={divRef}>
      <MatrixLeftBracket />
      <table>
        <tbody>
          {Util.range(height).map((_, y) => (
            <tr key={y}>
              {Util.range(width).map((_, x) => (
                <td key={x}>
                  <Input
                    ref={(el) => {
                      if (el !== null) {
                        if (inputRefs.current[x] === undefined)
                          inputRefs.current[x] = [];
                        inputRefs.current[x][y] = el;
                      }
                    }}
                    value={props.matrix[x][y] ?? ""}
                    onChange={(e) => handleMatrixInput(x, y, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <MatrixRightBracket />
    </MatrixContainer>
  );
}

type MatrixDisplayProps = {
  matrix: Matrix;
};

export function MatrixDisplay(props: MatrixDisplayProps) {
  const width = props.matrix.length;
  const height = props.matrix[0].length;

  return (
    <MatrixContainer>
      <MatrixLeftBracket />
      <table>
        <tbody>
          {Util.range(height).map((_, y) => (
            <tr key={y}>
              {Util.range(width).map((_, x) => (
                <td key={x}>
                  <InputReadonly
                    tabIndex={-1}
                    readOnly
                    value={props.matrix[x][y] ?? ""}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <MatrixRightBracket />
    </MatrixContainer>
  );
}
