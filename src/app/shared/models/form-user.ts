import {UsersUserWithPassword} from "@core/api";

export interface FormUser extends UsersUserWithPassword {
  confirmation?: string;
  checkbox?: string;
}
