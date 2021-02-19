import {
  ArithmeticMathSession,
  MathPractice,
  Matrix,
  MatrixMathSession,
  Util,
} from ".";

describe("Matrix", () => {
  it("should add correctly", () => {
    const mat1: Matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const mat2: Matrix = [
      [7, 8, 9],
      [10, 11, 12],
    ];
    expect(Util.matrix.add(mat1, mat2)).toEqual([
      [8, 10, 12],
      [14, 16, 18],
    ]);
  });
  it("should subtract correctly", () => {
    const mat1: Matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const mat2: Matrix = [
      [7, 8, 9],
      [10, 11, 12],
    ];
    expect(Util.matrix.sub(mat1, mat2)).toEqual([
      [-6, -6, -6],
      [-6, -6, -6],
    ]);
  });
  it("should multiply correctly", () => {
    const mat1: Matrix = [
      [1, 4],
      [2, 5],
      [3, 6],
    ];
    const mat2: Matrix = [
      [1, 3, 5],
      [2, 4, 6],
    ];
    expect(Util.matrix.mul(mat1, mat2)).toEqual([
      [22, 49],
      [28, 64],
    ]);
  });
});

describe("Math Session", () => {
  it("should generate properly (arithmetic)", () => {
    // Addition
    let session = MathPractice.newMathSession({
      type: "arithmetic",
      amount: 10,
      op: "+",
    }) as ArithmeticMathSession;
    expect(session.type).toBe("arithmetic");
    expect(session.questions).toHaveLength(10);
    let acutalAns = session.questions.map((q) => q.num1 + q.num2);
    let expectedAns = session.questions.map((q) => q.ans);
    expect(acutalAns).toEqual(expectedAns);
    // Subtraction
    session = MathPractice.newMathSession({
      type: "arithmetic",
      amount: 10,
      op: "-",
    }) as ArithmeticMathSession;
    expect(session.type).toBe("arithmetic");
    expect(session.questions).toHaveLength(10);
    acutalAns = session.questions.map((q) => q.num1 - q.num2);
    expectedAns = session.questions.map((q) => q.ans);
    // Multiplication
    expect(acutalAns).toEqual(expectedAns);
    session = MathPractice.newMathSession({
      type: "arithmetic",
      amount: 10,
      op: "*",
    }) as ArithmeticMathSession;
    expect(session.type).toBe("arithmetic");
    expect(session.questions).toHaveLength(10);
    acutalAns = session.questions.map((q) => q.num1 * q.num2);
    expectedAns = session.questions.map((q) => q.ans);
    expect(acutalAns).toEqual(expectedAns);
    // Division
    session = MathPractice.newMathSession({
      type: "arithmetic",
      amount: 10,
      op: "/",
    }) as ArithmeticMathSession;
    expect(session.type).toBe("arithmetic");
    expect(session.questions).toHaveLength(10);
    acutalAns = session.questions.map((q) => q.num1 / q.num2);
    expectedAns = session.questions.map((q) => q.ans);
    expect(acutalAns).toEqual(expectedAns);
  });
  it("should generate properly (matrix)", () => {
    // Addition
    let session = MathPractice.newMathSession({
      type: "matrix",
      amount: 10,
      op: "+",
    }) as MatrixMathSession;
    expect(session.type).toBe("matrix");
    expect(session.questions).toHaveLength(10);
    let acutalAns = session.questions.map((q) =>
      Util.matrix.add(q.mat1, q.mat2)
    );
    let expectedAns = session.questions.map((q) => q.ans);
    expect(acutalAns).toEqual(expectedAns);
    // Subtraction
    session = MathPractice.newMathSession({
      type: "matrix",
      amount: 10,
      op: "-",
    }) as MatrixMathSession;
    expect(session.type).toBe("matrix");
    expect(session.questions).toHaveLength(10);
    acutalAns = session.questions.map((q) => Util.matrix.sub(q.mat1, q.mat2));
    expectedAns = session.questions.map((q) => q.ans);
    expect(acutalAns).toEqual(expectedAns);
    // Multiplication
    session = MathPractice.newMathSession({
      type: "matrix",
      amount: 10,
      op: "*",
    }) as MatrixMathSession;
    expect(session.type).toBe("matrix");
    expect(session.questions).toHaveLength(10);
    acutalAns = session.questions.map((q) => Util.matrix.mul(q.mat1, q.mat2));
    expectedAns = session.questions.map((q) => q.ans);
    expect(acutalAns).toEqual(expectedAns);
  });
});
