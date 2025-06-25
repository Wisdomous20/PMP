import type { MetaFormat } from "@/lib/validators/formats/MetaFormat";

export const formatter: MetaFormat = {
  name: "non-empty-string-value",
  type: "string",
  validate: (v: string) => v !== null && v !== undefined && v.replace(/\s/g, "").length > 0,
};