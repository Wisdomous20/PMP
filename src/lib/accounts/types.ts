import type { GenericFailureType } from "@/lib/types/GenericFailureType";

export interface RegisterResult extends GenericFailureType {
  data?: {
    email: string;
  }
}
