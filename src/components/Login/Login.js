import React from "react";
import "./Login.scss";
import { Link } from "react-router-dom";
// import Google from "../../assets/images/google.png";
import Logo from "../../assets/images/circle_logo.png";
import { TfiClose } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { loginFetch } from "../../stores/apiAuthRequest";
import Loader from "../Loader/Loader";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { validateEmail } from "../../utils/validates";
import { clearErrorLogin } from "../../stores/authSlice";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [errorInput, setErrorInput] = useState({
    email: "",
  });
  const dispatch = useDispatch();
  const { error, errorMessage, isLoading } = useSelector(
    (state) => state?.auth?.login
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(clearErrorLogin());
    loginFetch(
      { email: email.toLowerCase(), password },
      dispatch,
      props.closeModal
    );
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    if (!validateEmail(email)) {
      setErrorInput((prevError) => ({
        ...prevError,
        email: "Email không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        email: "",
      }));
    }
  };

  return (
    <div className="login-form-container">
      <TfiClose onClick={props.closeModal} className="close" />
      <div className="header-login">
        <img src={Logo} alt="" />
        <h1>Đăng nhập</h1>
        {error && (
          <div>
            <span className="error-text" aria-hidden="true">
              {errorMessage.message === "user does not exist"
                ? "Email không tồn tại"
                : errorMessage.message === "incorrect password"
                ? "Mật khẩu không chính xác"
                : errorMessage.message ===
                  "You have not verified your email. Please check your email to verify your account."
                ? "Bạn chưa xác minh email. Vui lòng kiểm tra lại email của bạn để xác minh."
                : errorMessage.message === "internal_server_error"
                ? "Lỗi hệ thống. Vui lòng thử lại sau"
                : errorMessage.message === "User is already blocked"
                ? "Tài khoản của bạn đã bị chặn"
                : ""}
            </span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <p className="input-container">
          <label>
            Email
            <br />
            <span className="form-control-input" data-name="email">
              <input
                size="40"
                className="input"
                aria-required="true"
                aria-invalid="true"
                value={email}
                onChange={handleEmailChange}
                type="text"
                name="email"
                placeholder="Nhập email"
                required
              />
              {!!errorInput.email && (
                <span className="error-text" aria-hidden="true">
                  {errorInput.email}
                </span>
              )}
            </span>
          </label>
        </p>
        <p className="input-container">
          <label>
            Mật khẩu
            <br />
            <span className="form-control-input" data-name="email">
              <input
                size="40"
                className="input input-password"
                aria-required="true"
                aria-invalid="true"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={isShowPassword ? "text" : "password"}
                name="email"
                placeholder="Nhập mật khẩu"
                required
              />
              <Link
                className={"btn-show-password"}
                onClick={() => {
                  setIsShowPassword(!isShowPassword);
                }}
              >
                {isShowPassword ? (
                  <AiOutlineEye size={24} />
                ) : (
                  <AiOutlineEyeInvisible size={24} />
                )}
              </Link>
            </span>
          </label>
        </p>

        <div className="forgot-password">
          <Link onClick={props.showForget}>Quên mật khẩu?</Link>
        </div>
        <div className="btn-login">
          <button
            type="submit"
            className={`login${
              errorInput.email !== "" ? " error-disable" : ""
            }`}
            disabled={isLoading === true || errorInput.email !== ""}
          >
            {isLoading ? <Loader /> : "Đăng nhập"}
          </button>
          {/* <Link className={"google"}>
            <img src={Google} alt="" />
            Login with Google
          </Link> */}
        </div>
        <p className="sign-up">
          Bạn chưa có tài khoản?{" "}
          <Link onClick={props.showSignUp}>Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
