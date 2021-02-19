export type Vec2 = [number, number];
export type Matrix = number[][];
export type ArithmeticOperator = "+" | "-" | "*" | "/";
export type MatrixOperator = "+" | "-" | "*";

export type ArithmeticQuestion = {
  num1: number;
  num2: number;
  op: ArithmeticOperator;
  ans: number;
};
export type ArithmeticQuestionOption = {
  op: ArithmeticOperator;
};

export type MatrixQuestion = {
  mat1: Matrix;
  mat2: Matrix;
  op: MatrixOperator;
  ans: Matrix;
};
export type MatrixQuestionOption = {
  op: MatrixOperator;
};

export type ArithmeticMathSession = {
  type: "arithmetic";
  questions: ArithmeticQuestion[];
  times: number[];
  currentQuestion: number;
};
export type ArithmeticMathSessionOption = {
  type: "arithmetic";
  amount: number;
  op: ArithmeticOperator;
};

export type MatrixMathSession = {
  type: "matrix";
  questions: MatrixQuestion[];
  times: number[];
  currentQuestion: number;
};
export type MatrixMathSessionOption = {
  type: "matrix";
  amount: number;
  op: MatrixOperator;
};

export type MathSession = ArithmeticMathSession | MatrixMathSession;
export type MathSessionOption =
  | ArithmeticMathSessionOption
  | MatrixMathSessionOption;

export const Util = {
  range(start: number, stop?: number) {
    if (stop === undefined) {
      stop = start;
      start = 0;
    }
    return Array.from({ length: stop - start }, (_, i) => i + start);
  },
  randInt(min?: number, max?: number): number {
    if (min === undefined) {
      min = 0;
      max = 1;
    } else if (max === undefined) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min)) + min;
  },
  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i >= 1; i--) {
      let j = Util.randInt(i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
  matrix: {
    add(mat1: Matrix, mat2: Matrix): Matrix {
      const w1 = mat1.length;
      const w2 = mat2.length;
      const h1 = mat1[0].length;
      const h2 = mat2[0].length;
      if (w1 !== w2 || h1 !== h2) {
        throw new Error("Matrix Addition: Matricies must have same dimensions");
      }
      const mat: Matrix = [];
      for (let i = 0; i < w1; i++) {
        const col: number[] = [];
        for (let j = 0; j < h1; j++) {
          col.push(mat1[i][j] + mat2[i][j]);
        }
        mat.push(col);
      }
      return mat;
    },
    sub(mat1: Matrix, mat2: Matrix): Matrix {
      const w1 = mat1.length;
      const w2 = mat2.length;
      const h1 = mat1[0].length;
      const h2 = mat2[0].length;
      if (w1 !== w2 || h1 !== h2) {
        throw new Error(
          "Matrix Subtraction: Matricies must have same dimensions"
        );
      }
      const mat: Matrix = [];
      for (let i = 0; i < w1; i++) {
        const col: number[] = [];
        for (let j = 0; j < h1; j++) {
          col.push(mat1[i][j] - mat2[i][j]);
        }
        mat.push(col);
      }
      return mat;
    },
    mul(mat1: Matrix, mat2: Matrix) {
      const w1 = mat1.length;
      const w2 = mat2.length;
      const h1 = mat1[0].length;
      const h2 = mat2[0].length;
      if (w1 !== h2) {
        throw new Error(
          "Matrix Multiplication: Matrix 1 height not equal to Matrix 2 width"
        );
      }
      const mat: Matrix = [];
      for (let i = 0; i < h1; i++) {
        const col: number[] = [];
        for (let j = 0; j < w2; j++) {
          let sum = 0;
          for (let x = 0; x < w1; x++) {
            sum += mat1[x][j] * mat2[i][x];
          }
          col.push(sum);
        }
        mat.push(col);
      }
      return mat;
    },
    zeros(w: number, h: number): Matrix {
      const mat: Matrix = [];
      for (let i = 0; i < w; i++) {
        const col: number[] = [];
        for (let j = 0; j < h; j++) {
          col.push(0);
        }
        mat.push(col);
      }
      return mat;
    },
    rand(w: number, h: number, min?: number, max?: number) {
      const mat: Matrix = [];
      for (let i = 0; i < w; i++) {
        const col: number[] = [];
        for (let j = 0; j < h; j++) {
          col.push(Util.randInt(min, max));
        }
        mat.push(col);
      }
      return mat;
    },
    cmp(mat1: Matrix, mat2: Matrix): boolean {
      if (mat1.length !== mat2.length || mat1[0].length !== mat2[0].length) {
        return false;
      }
      for (let i = 0; i < mat1.length; i++) {
        for (let j = 0; j < mat1[0].length; j++) {
          if (mat1[i][j] !== mat2[i][j]) {
            return false;
          }
        }
      }
      return true;
    },
  },
};

export const MathPractice = {
  newMathSession(options: MathSessionOption): MathSession {
    if (options.type === "arithmetic") {
      const questions = MathPractice.getArithmeticQuestions(options.amount, {
        op: options.op,
      });
      return {
        type: options.type,
        questions,
        currentQuestion: 0,
        times: [],
      };
    } else {
      const questions = MathPractice.getMatrixQuestion(options.amount, {
        op: options.op,
      });
      return {
        type: options.type,
        questions,
        currentQuestion: 0,
        times: [],
      };
    }
  },
  getArithmeticQuestions(
    amount: number,
    options: ArithmeticQuestionOption
  ): ArithmeticQuestion[] {
    const nums: Vec2[] = [];
    while (nums.length < amount) {
      let arr: Vec2[] = [];
      for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= 12; j++) {
          arr.push([i, j]);
        }
      }
      nums.push(...Util.shuffle(arr));
    }
    const questions: ArithmeticQuestion[] = [];
    for (let i = 0; i < amount; i++) {
      switch (options.op) {
        case "+":
          questions.push({
            num1: nums[i][0],
            num2: nums[i][1],
            op: "+",
            ans: nums[i][0] + nums[i][1],
          });
          break;
        case "-":
          questions.push({
            num1: nums[i][0] + nums[i][1],
            num2: nums[i][1],
            op: "-",
            ans: nums[i][0],
          });
          break;
        case "*":
          questions.push({
            num1: nums[i][0],
            num2: nums[i][1],
            op: "*",
            ans: nums[i][0] * nums[i][1],
          });
          break;
        case "/":
          questions.push({
            num1: nums[i][0] * nums[i][1],
            num2: nums[i][1],
            op: "/",
            ans: nums[i][0],
          });
          break;
      }
    }
    return questions;
  },
  getMatrixQuestion(
    amount: number,
    options: MatrixQuestionOption
  ): MatrixQuestion[] {
    const questions: MatrixQuestion[] = [];
    for (let i = 0; i < amount; i++) {
      const mat1 = Util.matrix.rand(1, 2, 1, 12);
      const mat2 = Util.matrix.rand(2, 1, 1, 12);
      switch (options.op) {
        case "+":
          questions.push({
            mat1,
            mat2,
            op: options.op,
            ans: Util.matrix.add(mat1, mat2),
          });
          break;
        case "-":
          questions.push({
            mat1,
            mat2,
            op: options.op,
            ans: Util.matrix.sub(mat1, mat2),
          });
          break;
        case "*":
          questions.push({
            mat1,
            mat2,
            op: options.op,
            ans: Util.matrix.mul(mat1, mat2),
          });
          break;
      }
    }
    return questions;
  },
};
