import type { ErrorCodes } from "@/lib/ErrorCodes";

export interface GenericFailureType {
  code: ErrorCodes;
  message?: string;
}
