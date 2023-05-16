import React, { useRef, useState } from "react";
import "./ContactPage.scss";
import { isFullNameValid, validateEmail } from "../../utils/validates";
import Loader from "../../components/Loader/Loader";

const ContactPage = () => {
  const inputRef = useRef(null);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorInput, setErrorInput] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setName(name);
    if (!isFullNameValid(name)) {
      setErrorInput((prevError) => ({
        ...prevError,
        name: "Họ tên không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        name: "",
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

  const handleContentChange = (e) => {
    const content = e.target.value;
    setContent(content);
    if (content.length < 3) {
      setErrorInput((prevError) => ({
        ...prevError,
        content: "Nội dung không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        content: "",
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

  return (
    <div className="contact-container">
      <div className="contact-content grid-container">
        <div className="title">
          <h1>Liên hệ</h1>
        </div>
        <form className="form-container">
          <p className="input-container">
            <label>
              Họ tên
              <br />
              <span className="form-control-input" data-name="email">
                <input
                  size="40"
                  className="input"
                  aria-required="true"
                  aria-invalid="true"
                  value={name}
                  onChange={handleNameChange}
                  type="text"
                  name="name"
                  placeholder="Nhập họ tên"
                  required
                />
                {!!errorInput.name && (
                  <span className="error-text" aria-hidden="true">
                    {errorInput.name}
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
              Nội dung
              <br />
              <textarea
                ref={inputRef}
                value={content}
                onChange={handleContentChange}
                required
                placeholder="Viết nội dung..."
                className="input-text-area"
              />
              {!!errorInput.content && (
                <span className="error-text" aria-hidden="true">
                  {errorInput.content}
                </span>
              )}
            </label>
          </p>
          <button
            type="submit"
            disabled={isLoading === true || hasError()}
            className={`btn-send-contact${hasError() ? " error-disable" : ""}`}
          >
            {isLoading ? <Loader /> : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
