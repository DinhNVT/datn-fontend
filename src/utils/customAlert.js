import Swal from "sweetalert2";

export const errorAlert = (title, text) => {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
  });
};

export const successAlert = (title, text, timer = 1500) => {
  Swal.fire({
    icon: "success",
    title: title,
    text: text,
    showConfirmButton: false,
    timer,
  });
};
