import React from "react";
import "./ForgetPassword.scss";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/circle_logo.png";
import { TfiClose } from "react-icons/tfi";
import { FiCheckCircle } from "react-icons/fi";
import Loader from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { forgotFetch } from "../../stores/apiAuthRequest";
import { validateEmail } from "../../utils/validates";
import { forgetReset } from "../../stores/authNotSaveSlice";

const ForgetPassword = (props) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const dispatch = useDispatch();
  const { error, message, isLoading, success } = useSelector(
    (state) => state?.auth_not_save?.forgot
  );

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(forgetReset());
    const newUser = {
      email: email,
    };
    forgotFetch(newUser, dispatch);
  };

  return (
    <div>
      {!success ? (
        <div className="forgot-form-container">
          <TfiClose onClick={props.closeModal} className="close" />
          <div className="header-forgot">
            <img src={Logo} alt="" />
            <h1>Quên mật khẩu</h1>
            <p>
              Hãy cung cấp email để bắt đầu quá trình lấy lại mật khẩu của bạn.
            </p>
            {error && (
              <div>
                <span className="error-text" aria-hidden="true">
                  {message.message === "Invalid email"
                    ? "Email không tồn tại"
                    : message.message ===
                      "You have not verified your email. Please check your email to verify your account."
                    ? "Bạn chưa xác minh email. Vui lòng kiểm tra lại email của bạn để xác minh."
                    : message.message === ""}
                </span>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <p className="input-container">
              <label>
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
                  {!!emailError && (
                    <span className="error-text" aria-hidden="true">
                      {emailError}
                    </span>
                  )}
                </span>
              </label>
            </p>
            <div className="btn-forgot">
              <button
                type="submit"
                disabled={isLoading === true || emailError !== ""}
                className={`forgot${emailError !== "" ? " error-disable" : ""}`}
              >
                {isLoading ? <Loader /> : "Lấy lại mật khẩu"}
              </button>
              <Link onClick={props.showLogin} className={"login"}>
                Đăng nhập
              </Link>
            </div>
          </form>
          {/* <button onClick={props.toggleModal}>Close</button> */}
        </div>
      ) : (
        <div className="forgot-success-container">
          <TfiClose onClick={props.closeModal} className="close" />
          <FiCheckCircle className={"icon-check-success"} />
          <h2>Kiểm tra email</h2>
          <h4>
            Email khôi phục mật khẩu đã được gửi tới địa chỉ email của bạn. Nếu
            bạn không nhận được email trong vài phút, vui lòng kiểm tra hộp thư
            rác hoặc thử lại sau ít phút. (Lưu ý: email có thời hạn trong 5
            phút)
          </h4>
          <Link onClick={props.showLogin} className={"login"}>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
