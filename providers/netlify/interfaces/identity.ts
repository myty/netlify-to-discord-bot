import { Storage } from "./storage.ts";

export interface Identity {
  active_users: Storage;
  invite_only_users: Storage;
}
