import { instance } from "../utils/api";

export const apiCreateContact = (contact) =>
  instance.post(`/contact/`, contact);
