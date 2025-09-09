import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ITeleuserInfo {
  utc: Date;
  id: string;
  validated: boolean;
  first_n: string;
  second_n: string;
}

type IPromotask = {
  id: string;
  max: number;
  current: number;
};

export interface ITeleuserAuthorizedInfo {
  timetick: string;
  firstname: string;
  lastname: string;
  phone: string;
  avatar_file: string;
  email: string;
  trex_id: string;
  telegram: number;
  agent_id: string;
  agent_location: string;
  agent_userid: string;
  flags: number;
  company_name: string;
  app_limit: number;
  new_user_tariff_group: number;
  ga_id: string;
  agent_code: string;
  friend_code: string;
  promotasks: IPromotask[];
}

interface AuthState {
  teleuser: ITeleuserInfo | null;
  setTeleuser: (user: ITeleuserInfo) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      teleuser: null,
      setTeleuser: (user) => set({ teleuser: user }),
    }),
    { name: "auth-storage" } // Data is saved in localStorage
  )
);
