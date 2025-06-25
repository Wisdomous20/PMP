import { FormatDefinition } from "ajv";

export interface MetaFormat extends FormatDefinition<string> {
  name: string;
}