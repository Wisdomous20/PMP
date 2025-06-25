import type { MetaFormat } from "@/lib/validators/formats/MetaFormat";
import validate from "validator";

export const formatter: MetaFormat = {
  name: "strong-password",
  type: "string",
  validate: (v: string) => validate.isStrongPassword(v),
};
