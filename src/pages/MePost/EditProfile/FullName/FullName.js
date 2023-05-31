import React, { useEffect, useState } from "react";
import "./FullName.scss";
import { useDispatch, useSelector } from "react-redux";
import { refreshUserFetch } from "../../../../stores/apiAuthRequest";
import { isFullNameValid, isValidUsername } from "../../../../utils/validates";
import { apiUpdateUserProfile } from "../../../../apis/user";
import { successAlert } from "../../../../utils/customAlert";
import { errorAlert } from "../../../../utils/customAlert";
import Loader from "../../../../components/Loader/Loader";

const FullName = (props) => {
  const [valueText, setValueText] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [errorFetch, setErrorFetch] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const { user } = useSelector((state) => state?.auth?.login);
  const dispatch = useDispatch();
  const getUserByUserId = (dispatch) => {
    refreshUserFetch(dispatch);
  };

  useEffect(() => {
    getUserByUserId(dispatch);
    if (props?.status === "name") {
      setValueText(user?.name);
    } else if (props?.status === "username") {
      setValueText(user?.username);
    } else if (props?.status === "bio") {
      setValueText(user?.bio);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleValueTextChange = (e) => {
    const text = e.target.value;
    setValueText(text);
    if (props?.status === "name") {
      if (!isFullNameValid(text)) {
        setErrorInput("Tên không hợp lệ");
      } else {
        setErrorInput("");
      }
    } else if (props?.status === "username") {
      if (!isValidUsername(text)) {
        setErrorInput("Username không hợp lệ");
      } else {
        setErrorInput("");
      }
    }
  };

  const handleChange = (event) => {
    setValueText(event.target.value);
  };

  const options = [
    { id: "1", value: "Nông dân", label: "Nông dân" },
    { id: "2", value: "Chủ trang trại", label: "Chủ trang trại" },
    { id: "3", value: "Nhà nghiên cứu", label: "Nhà nghiên cứu" },
    { id: "4", value: "Ẩn danh", label: "Ẩn danh" },
  ];

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setErrorFetch("");
    setIsLoading(true);
    try {
      let data;
      if (props?.status === "name") {
        data = { name: valueText };
      } else if (props?.status === "username") {
        data = { username: valueText };
      } else if (props?.status === "bio") {
        data = { bio: valueText };
      }
      await apiUpdateUserProfile(user._id, props?.status, data);
      setIsLoading(false);
      props.closeModal();
      refreshUserFetch(dispatch);
      successAlert("Cập nhật thành công", "", 1500);
    } catch (error) {
      console.log(error);
      setErrorFetch(error.response?.data?.message);
      setIsLoading(false);
      if (
        props?.status !== "username" ||
        error.response?.data?.message !== "Username already exists"
      ) {
        errorAlert(
          "Cập nhật không thành công",
          "Đã có lỗi xảy ra! Vui lòng thử lại sau"
        );
        props.closeModal();
      }
    }
  };

  return (
    <div className="full-name-content">
      <form onSubmit={handleOnSubmit}>
        {(props?.status === "username" || props?.status === "name") && (
          <div className="input-container">
            <h3>
              {props?.status === "name"
                ? "Họ tên"
                : props?.status === "username"
                ? "Username"
                : ""}
            </h3>
            <input
              size="40"
              className="input"
              value={valueText}
              onChange={handleValueTextChange}
              type="text"
              name="textValue"
              placeholder={
                props?.status === "name"
                  ? "Nhập họ tên"
                  : props?.status === "username"
                  ? "Nhập username"
                  : ""
              }
              required
            />
            {!!errorInput && (
              <span className="error-text" aria-hidden="true">
                {errorInput}
              </span>
            )}
            {errorFetch === "Username already exists" && (
              <span className="error-text" aria-hidden="true">
                Username đã tồn tại
              </span>
            )}
            {props?.status === "username" && (
              <span className="error-text note" aria-hidden="true">
                {`(*username chỉ được các ký tự a-z và 0-9)`}
              </span>
            )}
          </div>
        )}
        {props?.status === "bio" && (
          <p className="input-container-select">
            <label>
              Nghề nghiệp
              <br />
              <span className="form-control-input" data-name="title">
                <select
                  id="cars"
                  value={valueText}
                  onChange={handleChange}
                  className="input-select"
                >
                  {options?.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </span>
            </label>
          </p>
        )}

        <div className="btn-container">
          <button
            onClick={props.closeModal}
            className="btn btn-cancel"
            type="button"
          >
            Hủy
          </button>
          <button
            disabled={isLoading === true || errorInput}
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

export default FullName;
