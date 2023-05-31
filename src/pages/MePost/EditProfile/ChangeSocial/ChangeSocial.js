import React, { useEffect, useState } from "react";
import "./ChangeSocial.scss";
import { useDispatch, useSelector } from "react-redux";
import { refreshUserFetch } from "../../../../stores/apiAuthRequest";
import { isValidUrl } from "../../../../utils/validates";
import Loader from "../../../../components/Loader/Loader";
import { apiUpdateUserProfile } from "../../../../apis/user";
import { errorAlert, successAlert } from "../../../../utils/customAlert";

const ChangeSocial = (props) => {
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [errorInput, setErrorInput] = useState({
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
  });
  const [isLoading, setIsLoading] = useState("");

  const { user } = useSelector((state) => state?.auth?.login);
  const dispatch = useDispatch();
  const getUserByUserId = (dispatch) => {
    refreshUserFetch(dispatch);
  };

  useEffect(() => {
    getUserByUserId(dispatch);
    setFacebook(user?.social?.facebook);
    setInstagram(user?.social?.instagram);
    setYoutube(user?.social?.youtube);
    setTiktok(user?.social?.tiktok);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleFacebookChange = (e) => {
    const text = e.target.value;
    setFacebook(text);
    if (!isValidUrl(text) && text.length > 0) {
      setErrorInput((prevError) => ({
        ...prevError,
        facebook: "Link facebook không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        facebook: "",
      }));
    }
  };
  const handleInstagramChange = (e) => {
    const text = e.target.value;
    setInstagram(text);
    if (!isValidUrl(text) && text.length > 0) {
      setErrorInput((prevError) => ({
        ...prevError,
        instagram: "Link instagram không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        instagram: "",
      }));
    }
  };

  const handleYoutubeChange = (e) => {
    const text = e.target.value;
    setYoutube(text);
    if (!isValidUrl(text) && text.length > 0) {
      setErrorInput((prevError) => ({
        ...prevError,
        youtube: "Link youtube không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        youtube: "",
      }));
    }
  };

  const handleTiktokChange = (e) => {
    const text = e.target.value;
    setTiktok(text);
    if (!isValidUrl(text) && text.length > 0) {
      setErrorInput((prevError) => ({
        ...prevError,
        tiktok: "Link tiktok không hợp lệ",
      }));
    } else {
      setErrorInput((prevError) => ({
        ...prevError,
        tiktok: "",
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
    setIsLoading(true);
    try {
      await apiUpdateUserProfile(user._id, "social", {
        social: {
          facebook: facebook,
          instagram: instagram,
          youtube: youtube,
          tiktok: tiktok,
        },
      });
      setIsLoading(false);
      props.closeModal();
      refreshUserFetch(dispatch);
      successAlert("Cập nhật thành công", "", 1500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      errorAlert(
        "Cập nhật không thành công",
        "Đã có lỗi xảy ra! Vui lòng thử lại sau"
      );
      props.closeModal();
    }
  };

  return (
    <div className="change-password-content">
      <form onSubmit={handleOnSubmit}>
        <div className="input-content">
          <h3>Mạng xã hội</h3>
          <p className="input-container">
            <label>
              Link Facebook
              <br />
              <span className="form-control-input">
                <input
                  size="40"
                  className="input"
                  value={facebook}
                  onChange={handleFacebookChange}
                  type="text"
                  name="facebook"
                  placeholder="Dán dường link facebook"
                />
                {!!errorInput.facebook && (
                  <span className="error-text" aria-hidden="true">
                    {errorInput.facebook}
                  </span>
                )}
              </span>
            </label>
          </p>
          <p className="input-container">
            <label>
              Link Instagram
              <br />
              <span className="form-control-input">
                <input
                  size="40"
                  className="input"
                  value={instagram}
                  onChange={handleInstagramChange}
                  type="text"
                  name="instagram"
                  placeholder="Dán dường link instagram"
                />
                {!!errorInput.instagram && (
                  <span className="error-text" aria-hidden="true">
                    {errorInput.instagram}
                  </span>
                )}
              </span>
            </label>
          </p>
          <p className="input-container">
            <label>
              Link Youtube
              <br />
              <span className="form-control-input">
                <input
                  size="40"
                  className="input"
                  value={youtube}
                  onChange={handleYoutubeChange}
                  type="text"
                  name="youtube"
                  placeholder="Dán dường link youtube"
                />
                {!!errorInput.youtube && (
                  <span className="error-text" aria-hidden="true">
                    {errorInput.youtube}
                  </span>
                )}
              </span>
            </label>
          </p>
          <p className="input-container">
            <label>
              Link TikTok
              <br />
              <span className="form-control-input">
                <input
                  size="40"
                  className="input"
                  value={tiktok}
                  onChange={handleTiktokChange}
                  type="text"
                  name="tiktok"
                  placeholder="Dán dường link tiktok"
                />
                {!!errorInput.tiktok && (
                  <span className="error-text" aria-hidden="true">
                    {errorInput.tiktok}
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

export default ChangeSocial;
