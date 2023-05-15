import Swal from "sweetalert2";

export const errorAlert = (title, text) => {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonColor: "#98a2b3",
  });
};

export const successAlert = (
  title,
  text,
  timer = 1500,
  isShowConfirmButton = false
) => {
  Swal.fire({
    icon: "success",
    title: title,
    text: text,
    showConfirmButton: isShowConfirmButton,
    timer,
    confirmButtonColor: "#00c491",
  });
};

export const deleteAlert = (
  title,
  text,
  confirmDelete,
  handleDeleteSuccess
) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#00c491",
    cancelButtonColor: "#98a2b3",
    confirmButtonText: "Xóa",
    cancelButtonText: "Thoát",
    allowOutsideClick: () => !Swal.isLoading(),
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        await confirmDelete();
        handleDeleteSuccess();
      } catch (error) {
        const errorTitle = "Xóa không thành công";
        const errorMessage = "Có một số lỗi khi xóa. Vui lòng thử lại sau";
        errorAlert(errorTitle, errorMessage);
        throw new Error("Delete failed.");
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      successAlert("Đã xóa", "Bài viết của bạn đã xóa thành công", 1500, true);
    }
  });
};
