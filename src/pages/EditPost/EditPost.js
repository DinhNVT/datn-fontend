import React, { useState, useEffect, useRef } from "react";
import "./EditPost.scss";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import Loader from "../../components/Loader/Loader";
import { Editor as ClassicEditor } from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  apiGetAllTags,
  apiGetDetailPostByRole,
  updatePost,
} from "../../apis/post";
import { getAllCategories } from "../../apis/category";
import { errorAlert, successAlert } from "../../utils/customAlert";
import { deburr } from "lodash";
import { truncateTitle } from "../../utils/truncateString";
import WritePostSkeleton from "../../components/Skeleton/WritePostSkeleton/WritePostSkeleton";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [image, setImage] = useState("");

  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [isFetchPost, setIsFetchPost] = useState(true);

  const [options, setOptions] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isFetchCategories, setIsFetchCategories] = useState(true);

  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState([]);
  const inputRef = useRef(null);
  const [filteredTags, setFilteredTags] = useState([]);

  const [allTags, setAllTags] = useState([]);
  const [allTagsLoading, setAllTagsLoading] = useState(false);
  const [isFetchAllTags, setIsFetchAllTags] = useState(true);

  const getPostDetailByRole = async (id) => {
    setPostLoading(true);
    try {
      const res = await apiGetDetailPostByRole(id);
      setPost(res.data.result);
      setTitle(res.data.result.title);
      setCategoryId(res.data.result.categoryId);
      setTags(res.data.result.tags.map((tag) => tag.name));
      setImage(res.data.result.thumbnail_url);
      setContent(res.data.result.content);
    } catch (error) {
      console.log(error);
    } finally {
      setPostLoading(false);
      setIsFetchPost(false);
    }
  };

  const getAllTags = async () => {
    setAllTagsLoading(true);
    try {
      const res = await apiGetAllTags();
      if (res.data.tags.length > 0) {
        setAllTags(res.data.tags);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAllTagsLoading(false);
      setIsFetchAllTags(false);
    }
  };

  useEffect(() => {
    getAllTags();
    getPostDetailByRole(id);
    renderAllCategories();
  }, [id]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setTitle(title);
  };

  const handleChangeCategoryId = (event) => {
    setCategoryId(event.target.value);
  };

  const renderAllCategories = async () => {
    setCategoriesLoading(true);
    try {
      const categories = await getAllCategories();
      const option = categories.data.sortedCategories.map((category) => ({
        id: category._id,
        name: category.name,
      }));
      setOptions(option);
    } catch (error) {
      console.log(error);
    } finally {
      setCategoriesLoading(false);
      setIsFetchCategories(false);
    }
  };

  //Tag
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const normalizedValue = deburr(value.toLowerCase());
    const filtered = allTags.filter((tag) =>
      deburr(tag.name.toLowerCase()).includes(normalizedValue)
    );
    setFilteredTags(filtered);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
      inputRef.current?.focus();
    }
    setInputValue("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleInputConfirm();
    }
  };

  //content
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setContent(data);
  };

  //image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png"].indexOf(extension) !== -1) {
        setThumbnail(file);
        const reader = new FileReader();

        reader.onload = (e) => {
          setImage(e.target.result);
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

  //handle update post
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
    if (!thumbnail && !image) {
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
    if (!!thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    formData.append("content", content);
    formData.append("status", status);
    formData.append("tags", tags.join(","));

    try {
      const res = await updatePost(formData, id);
      if (res.status >= 200 && res.status < 300) {
        successAlert("Thành công", "", 2000);
      }
    } catch (error) {
      errorAlert("Đã xảy ra lỗi");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-post-container">
      {(isFetchAllTags ||
        isFetchCategories ||
        isFetchPost ||
        postLoading ||
        categoriesLoading ||
        allTagsLoading) && <WritePostSkeleton />}
      {options.length > 0 &&
        !!post &&
        !isFetchAllTags &&
        !isFetchCategories &&
        !isFetchPost && (
          <div className="edit-post-content grid-container">
            <h1 className="title-edit-post">Chỉnh sửa bài viết</h1>
            <div className="btn-post-group">
              <button
                onClick={() => {
                  navigate(-1);
                }}
                disabled={isLoading === true}
                className="btn-item-post btn-save"
              >
                Hủy
              </button>
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
                  "Lưu bài viết"
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
                      onChange={handleChangeCategoryId}
                      className="input-select"
                    >
                      {options?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
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
                    <div className="input-tag-container">
                      <input
                        ref={inputRef}
                        type="text"
                        className="input-tag"
                        placeholder="Thêm thẻ..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={() => {
                          if (filteredTags.length === 0) {
                            handleInputConfirm();
                          }
                        }}
                        onKeyDown={handleKeyDown}
                      />
                      {!!filteredTags.length > 0 && !!inputValue ? (
                        <div className="dropdown-tag">
                          <ul>
                            {filteredTags.map((tag, index) => (
                              <li
                                onClick={() => {
                                  if (tags.indexOf(tag.name) === -1) {
                                    setTags([...tags, tag.name]);
                                    inputRef.current?.focus();
                                  }
                                  setInputValue("");
                                }}
                                key={tag._id}
                              >
                                {truncateTitle(tag.name, 30)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </span>
                </span>
              </p>
              <p className="input-image-container">
                <label
                  className={`choose-image${!!image ? " have-image" : ""}`}
                  htmlFor="imageInput"
                >
                  {!!image ? (
                    <img className="image" src={image} alt="" />
                  ) : (
                    <div className="image-none">
                      <h2>Chọn ảnh bìa</h2>
                      <p>Hỗ trợ các file: jpeg, jpg, png</p>
                      <FiUpload className={"icon-upload"} size={48} />
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  id="imageInput"
                  className="image-input"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleFileChange}
                />
              </p>
            </form>
            <CKEditor
              editor={ClassicEditor}
              config={{
                removePlugins: ["MarkDown"],
                placeholder: "Nhập nội dung ở đây...",
                toolbar: { shouldNotGroupWhenFull: true },
                markdown: {
                  enabled: true,
                },
              }}
              data={content}
              onChange={handleEditorChange}
            />
          </div>
        )}
    </div>
  );
};

export default EditPost;
