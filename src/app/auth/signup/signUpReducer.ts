// State type
export interface SignUpState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string;
}

// Action types
export type SignUpAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET_ERROR" };

// Initial state
export const initialState: SignUpState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  isLoading: false,
  error: "",
};

// Reducer function
export function signUpReducer(
  state: SignUpState,
  action: SignUpAction
): SignUpState {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET_ERROR":
      return { ...state, error: "" };
    default:
      return state;
  }
}
