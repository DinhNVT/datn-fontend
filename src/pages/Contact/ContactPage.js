import React, { useRef, useState } from "react";
import "./ContactPage.scss";
import { validateEmail } from "../../utils/validates";
import Loader from "../../components/Loader/Loader";
import { apiCreateContact } from "../../apis/contact";
import { errorAlert, successAlert } from "../../utils/customAlert";

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
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiCreateContact({
        fullName: name,
        email: email,
        content: content,
      });
      setIsLoading(false);
      successAlert(
        "Đã gửi liên hệ",
        "Chúng tôi sẽ gửi lại phản hồi cho bạn sớm qua email bạn cung cấp",
        3000,
        true
      );
    } catch (error) {
      setIsLoading(false);
      errorAlert("Không gửi được", "Đã xảy ra lỗi! Vui lòng thử lại sau");
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-content grid-container">
        <div className="title">
          <h1>Liên hệ</h1>
        </div>
        <form onSubmit={handleOnSubmit} className="form-container">
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
            </label>
          </p>
          <button
            type="submit"
            disabled={isLoading === true || errorInput.email}
            className={`btn-send-contact${
              errorInput.email ? " error-disable" : ""
            }`}
          >
            {isLoading ? <Loader /> : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
