import React, { useState, useEffect, useRef } from "react";
import { Editor as ClassicEditor } from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "./WritePost.scss";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { getAllCategories } from "../../apis/category";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategoryId,
  setTitle,
  setThumbnail,
  setImage,
  setContent,
  setTags,
  clearCreatePost,
} from "../../stores/postSlice";
import { createPost } from "../../apis/post";
import Loader from "../../components/Loader/Loader";
import { errorAlert, successAlert } from "../../utils/customAlert";

const WritePost = () => {
  const inputRef = useRef(null);
  // const [content, setContent] = useState("");
  // const [title, setTitle] = useState("");
  // const [thumbnail, setThumbnail] = useState(null);
  // const [image, setImage] = useState("");
  const [options, setOptions] = useState([]);
  // const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();
  const { categoryId, title, thumbnail, image, content, tags } = useSelector(
    (state) => state?.post?.createPost
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png"].indexOf(extension) !== -1) {
        dispatch(setThumbnail(file));
        const reader = new FileReader();

        reader.onload = (e) => {
          dispatch(setImage(e.target.result));
        };

        reader.readAsDataURL(file);
      } else {
        errorAlert(
          "Lỗi chọn ảnh",
          "Vui lòng chọn file ảnh có định dạng jpg, png hoặc gif"
        );
      }
    }
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    dispatch(setContent(data));
  };

  const renderAllCategories = async () => {
    const categories = await getAllCategories();
    const option = categories.data.sortedCategories.map((category) => ({
      id: category._id,
      name: category.name,
    }));
    setOptions(option);
  };

  useEffect(() => {
    renderAllCategories();
    const unloadHandler = (event) => {
      event.preventDefault();
      event.returnValue = "Bạn có chắc chắn muốn thoát không?";
    };

    window.addEventListener("beforeunload", unloadHandler);
    return () => {
      window.removeEventListener("beforeunload", unloadHandler);
    };
  }, []);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    dispatch(setTitle(title));
  };

  const handleChange = (event) => {
    dispatch(setCategoryId(event.target.value));
  };

  //Tag
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    dispatch(setTags(newTags));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      dispatch(setTags([...tags, inputValue]));
      inputRef.current?.focus();
    }
    setInputValue("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleInputConfirm();
    }
  };

  // const uploadAdapter = (loader) => {
  //   return {
  //     upload: () => {
  //       return new Promise((resolve, reject) => {
  //         const formData = new FormData();
  //         loader.file.then(async (file) => {
  //           formData.append("image", file);
  //           try {
  //             const res = await uploadImagePost(formData);
  //             resolve({ default: res.data.url });
  //           } catch (error) {
  //             console.log(error)
  //             reject(error);
  //           }
  //         });
  //       });
  //     },
  //   };
  // };

  // const uploadPlugin = (editor) => {
  //   editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
  //     return uploadAdapter(loader);
  //   };
  // };
  const handleSubmitPost = async (status) => {
    setIsLoading(true);
    const formData = new FormData();
    if (status === "published") {
      setStatus("published");
    } else if (status === "draft") {
      setStatus("draft");
    }
    if (title.length < 2) {
      errorAlert("Lỗi", "Vui lòng điền tiêu đề");
      setIsLoading(false);
      return;
    }
    if (!categoryId) {
      errorAlert("Lỗi", "Vui lòng chọn chủ đề");
      setIsLoading(false);
      return;
    }
    if (tags.length < 1 || tags.length > 6) {
      errorAlert("Lỗi", "Thẻ chỉ phải có ít nhất 1 và nhiều nhất là 6");
      setIsLoading(false);
      return;
    }
    if (!thumbnail) {
      errorAlert("Lỗi", "Vui lòng chọn ảnh bìa");
      setIsLoading(false);
      return;
    }
    if (!content) {
      errorAlert("Lỗi", "Vui lòng điền nội dung");
      setIsLoading(false);
      return;
    }
    formData.append("categoryId", categoryId);
    formData.append("title", title);
    formData.append("thumbnail", thumbnail);
    formData.append("content", content);
    formData.append("status", status);
    formData.append("tags", tags.join(","));

    try {
      const res = await createPost(formData);
      if (res.status >= 200 && res.status < 300) {
        successAlert("Thành công", "", 2000);
        dispatch(clearCreatePost());
      }
    } catch (error) {
      errorAlert("Đã xảy ra lỗi");
      console.log(error.res.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="write-container">
      <div className="write-content grid-container">
        <div className="btn-post-group">
          <button
            onClick={() => {
              handleSubmitPost("draft");
            }}
            disabled={isLoading === true}
            className="btn-item-post btn-save"
          >
            {isLoading === true && status === "draft" ? (
              <Loader />
            ) : (
              "Lưu bản nháp"
            )}
          </button>
          <button
            onClick={() => {
              handleSubmitPost("published");
            }}
            disabled={isLoading === true}
            className="btn-item-post btn-post"
          >
            {isLoading === true && status === "published" ? (
              <Loader />
            ) : (
              "Đăng bài viết"
            )}
          </button>
        </div>
        <form>
          <p className="input-container">
            <label>
              Tiêu đề*
              <br />
              <span className="form-control-input" data-name="title">
                <input
                  size="40"
                  className="input"
                  aria-required="true"
                  aria-invalid="true"
                  value={title}
                  onChange={handleTitleChange}
                  type="text"
                  name="title"
                  placeholder="Nhập tiêu đề"
                  required
                />
              </span>
            </label>
          </p>
          <p className="input-container">
            <label>
              Chủ đề*
              <br />
              <span className="form-control-input" data-name="title">
                <select
                  id="cars"
                  value={categoryId}
                  onChange={handleChange}
                  className="input-select"
                >
                  <option value="">--Chọn chủ đề--</option>
                  {options?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                {/* {!!errorInput.email && (
                  <span className="error-text" aria-hidden="true">
                    {errorInput.email}
                  </span>
                )} */}
              </span>
            </label>
          </p>
          <p className="tag-container">
            <span className="title">
              {`Thêm thẻ (nhấn enter để thêm)*`}
              <br />
              <span className="form-control-input" data-name="title">
                {tags.map((tag, index) => (
                  <span key={tag} className="tag-display">
                    <span>
                      <span className={`tag-item tag-${index + 1}`}>#</span>
                      {` ${tag}`}
                    </span>
                    <Link onClick={() => handleClose(tag)}>
                      <IoClose className={"close"} />
                    </Link>
                  </span>
                ))}
                <input
                  ref={inputRef}
                  type="text"
                  className="input-tag"
                  placeholder="Thêm thẻ..."
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onKeyDown={handleKeyDown}
                />
              </span>
            </span>
          </p>
          <p className="input-image-container">
            <label
              className={`choose-image${!!thumbnail ? " have-image" : ""}`}
              htmlFor="imageInput"
            >
              {!!thumbnail ? (
                <img className="image" src={image} alt="" />
              ) : (
                <div className="image-none">
                  <h2>Chọn ảnh bìa</h2>
                  <p>Hỗ trợ các file: jpeg, jpg, png</p>
                  <FiUpload className={"icon-upload"} size={48} />
                </div>
              )}
            </label>
            {/* {!!thumbnail && (
              <IoClose
                onClick={() => {
                  setImage("");
                  setThumbnail(null);
                }}
                size={48}
                className={"delete-image"}
              />
            )} */}
            <input
              type="file"
              id="imageInput"
              className="image-input"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleFileChange}
            />

            {/* {!!errorInput.email && (
                  <span className="error-text" aria-hidden="true">
                    {errorInput.email}
                  </span>
                )} */}
          </p>
        </form>
        <CKEditor
          editor={ClassicEditor}
          config={{
            // extraPlugins: [uploadPlugin],
            removePlugins: ["MarkDown"],
            placeholder: "Nhập nội dung ở đây...",
            toolbar: { shouldNotGroupWhenFull: true },
            markdown: {
              enabled: true,
            },
          }}
          data={content}
          onChange={handleEditorChange}
          // onReady={(editor) => {
          //   // You can store the "editor" and use when it is needed.
          //   console.log("Editor is ready to use!", editor);
          // }}
        />
      </div>
      {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
    </div>
  );
};

export default WritePost;