import React, { useState } from "react";
import "./ChangePassword.scss";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { isPasswordValid } from "../../../../utils/validates";
import Loader from "../../../../components/Loader/Loader";
import { errorAlert, successAlert } from "../../../../utils/customAlert";
import { apiChangePasswordUser } from "../../../../apis/user";

const ChangePassword = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorInput, setErrorInput] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errorFetch, setErrorFetch] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowOldPassword, setIsShowOldPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOldPasswordChange = (e) => {
    const text = e.target.value;
    setOldPassword(text);
  };

  const handleNewPasswordChange = (e) => {
    const text = e.target.value;
    setNewPassword(text);
    if (!isPasswordValid(text)) {
      setErrorInput((prevError) => ({
        ...prevError,
        newPassword: "Mật khẩu không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        newPassword: "",
      }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const text = e.target.value;
    setConfirmPassword(text);
    if (text !== newPassword) {
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

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setErrorFetch("");
    setIsLoading(true);
    try {
      await apiChangePasswordUser({ oldPassword, newPassword });
      setIsLoading(false);
      props.closeModal();
      successAlert("Cập nhật thành công", "", 1500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setErrorFetch(error.response?.data?.message);
      if (error.response?.data?.message !== "incorrect old password") {
        errorAlert(
          "Đổi mật khẩu không thành công",
          "Đã có lỗi xảy ra! Vui lòng thử lại sau"
        );
        props.closeModal();
      }
    }
  };

  return (
    <div className="change-password-content">
      <form onSubmit={handleOnSubmit}>
        <div className="input-content">
          <h3>Thay đổi mật khẩu</h3>
          <p className="input-container">
            <label>
              Mật khẩu cũ <span className="request-text">*</span>
              <br />
              <span className="form-control-input" data-name="title">
                <input
                  size="40"
                  className="input input-password"
                  aria-required="true"
                  aria-invalid="true"
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                  type={isShowOldPassword ? "text" : "password"}
                  name="old-password"
                  placeholder="Nhập mật khẩu cũ"
                  required
                />
                <Link
                  className={"btn-show-password"}
                  onClick={() => {
                    setIsShowOldPassword(!isShowOldPassword);
                  }}
                >
                  {isShowOldPassword ? (
                    <AiOutlineEye size={24} />
                  ) : (
                    <AiOutlineEyeInvisible size={24} />
                  )}
                </Link>
                {errorFetch === "incorrect old password" && (
                  <span className="error-text" aria-hidden="true">
                    Mật khẩu cũ không chính xác
                  </span>
                )}
              </span>
            </label>
          </p>
          <p className="input-container">
            <label>
              Mật khẩu mới <span className="request-text">*</span>
              <br />
              <span className="form-control-input" data-name="title">
                <input
                  size="40"
                  className="input input-password"
                  aria-required="true"
                  aria-invalid="true"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  type={isShowPassword ? "text" : "password"}
                  name="new-password"
                  placeholder="Nhập mật khẩu mới"
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
                {!!errorInput.newPassword && (
                  <span className="error-text" aria-hidden="true">
                    {errorInput.newPassword}
                  </span>
                )}
                <span className="error-text note" aria-hidden="true">
                  {`(*mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự)`}
                </span>{" "}
              </span>
            </label>
          </p>
          <p className="input-container">
            <label>
              Xác nhận mật khẩu <span className="request-text">*</span>
              <br />
              <span className="form-control-input" data-name="title">
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
        </div>
        <div className="btn-container">
          <button
            onClick={props.closeModal}
            className="btn btn-cancel"
            type="button"
          >
            Hủy
          </button>
          <button
            disabled={isLoading === true || hasError()}
            className="btn btn-save"
            type="submit"
          >
            {isLoading ? <Loader /> : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
