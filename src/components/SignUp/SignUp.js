import React from "react";
import "./SignUp.scss";
import { Link } from "react-router-dom";
// import Google from "../../assets/images/google.png";
import Logo from "../../assets/images/circle_logo.png";
import { TfiClose } from "react-icons/tfi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerFetch } from "../../stores/apiAuthRequest";
import { FiCheckCircle } from "react-icons/fi";
import Loader from "../Loader/Loader";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import {
  validateEmail,
  isPasswordValid,
  isFullNameValid,
} from "../../utils/validates";
import { registerReset } from "../../stores/authNotSaveSlice";

const SignUp = (props) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [errorInput, setErrorInput] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const { error, message, isLoading, success } = useSelector(
    (state) => state?.auth_not_save?.register
  );

  const handleFullNamChange = (e) => {
    const fullName = e.target.value;
    setFullName(fullName);
    if (!isFullNameValid(fullName)) {
      setErrorInput((prevError) => ({
        ...prevError,
        fullName: "Họ tên không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        fullName: "",
      }));
    }
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

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
    if (!isPasswordValid(password)) {
      setErrorInput((prevError) => ({
        ...prevError,
        password: "Mật khẩu không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        password: "",
      }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    if (password !== confirmPassword) {
      setErrorInput((prevError) => ({
        ...prevError,
        confirmPassword: "Mật khẩu không khớp",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        confirmPassword: "",
      }));
    }
  };

  const hasError = () => {
    for (const key in errorInput) {
      if (errorInput[key]) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(registerReset());
    const newUser = {
      name: fullName,
      email: email.toLowerCase(),
      password: password,
    };
    registerFetch(newUser, dispatch);
  };

  return (
    <div>
      {!success ? (
        <div className="sign-up-form-container">
          <TfiClose onClick={props.closeModal} className="close" />
          <div className="header-sign-up">
            <img src={Logo} alt="" />
            <h1>Đăng ký</h1>
            {error && (
              <div>
                <span className="error-text" aria-hidden="true">
                  {message.message === "User already exists"
                    ? "Email này đã đăng ký"
                    : message.message === "internal_server_error"
                    ? "Lỗi hệ thống. Vui lòng thử lại sau"
                    : ""}
                </span>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <p className="input-container">
              <label>
                Họ tên
                <br />
                <span className="form-control-input" data-name="full-name">
                  <input
                    size="40"
                    className="input"
                    aria-required="true"
                    aria-invalid="true"
                    value={fullName}
                    onChange={handleFullNamChange}
                    type="text"
                    name="full-name"
                    placeholder="Nhập họ tên"
                    required
                  />
                  {!!errorInput.fullName && (
                    <span className="error-text" aria-hidden="true">
                      {errorInput.fullName}
                    </span>
                  )}
                </span>
              </label>
            </p>
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
                <span className="form-control-input" data-name="password">
                  <input
                    size="40"
                    className="input input-password"
                    aria-required="true"
                    aria-invalid="true"
                    value={password}
                    onChange={handlePasswordChange}
                    type={isShowPassword ? "text" : "password"}
                    name="password"
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
                  <span className="error-text note" aria-hidden="true">
                    {`(*mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự)`}
                  </span>
                  {!!errorInput.password && (
                    <span className="error-text" aria-hidden="true">
                      {errorInput.password}
                    </span>
                  )}
                </span>
              </label>
            </p>
            <p className="input-container">
              <label>
                Xác nhận mật khẩu
                <br />
                <span
                  className="form-control-input"
                  data-name="confirm-password"
                >
                  <input
                    size="40"
                    className="input input-password"
                    aria-required="true"
                    aria-invalid="true"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    type={isShowPassword ? "text" : "password"}
                    name="confirm-password"
                    placeholder="Nhập lại mật khẩu"
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
                  {!!errorInput.confirmPassword && (
                    <span className="error-text" aria-hidden="true">
                      {errorInput.confirmPassword}
                    </span>
                  )}
                </span>
              </label>
            </p>
            <div className="forgot-password">
              <Link onClick={props.showForget}>Quên mật khẩu?</Link>
            </div>
            <div className="btn-sign-up">
              <button
                type="submit"
                disabled={isLoading === true || hasError()}
                className={`sign-up${hasError() ? " error-disable" : ""}`}
              >
                {isLoading ? <Loader /> : "Đăng ký"}
              </button>
              {/* <Link className={"google"}>
                <img src={Google} alt="" />
                Login with Google
              </Link> */}
            </div>
            <p className="login-in">
              Bạn đã có tài khoản?{" "}
              <Link onClick={props.showLogin}>Đăng nhập</Link>
            </p>
          </form>
        </div>
      ) : (
        <div className="register-success-container">
          <TfiClose
            onClick={() => {
              props.closeModal();
            }}
            className="close"
          />
          <FiCheckCircle className={"icon-check-success"} />
          <h2>Đăng ký thành công</h2>
          <h4>
            Email xác nhận đăng ký tài khoản đã được gửi tới địa chỉ email của
            bạn. Nếu bạn không nhận được email trong vài phút, vui lòng kiểm tra
            hộp thư rác hoặc thử lại sau ít phút.
          </h4>
          <Link
            onClick={() => {
              props.showLogin();
            }}
            className={"login"}
          >
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
};

export default SignUp;
