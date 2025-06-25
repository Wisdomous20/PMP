import Ajv, { Schema, JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import addKeywords from "ajv-keywords";
import type { MetaFormat } from "@/lib/validators/formats/MetaFormat";

// Formatters
import * as nes from "@/lib/validators/formats/non-empty-string-value";
import * as spw from "@/lib/validators/formats/strong-password";

declare global {
  var globalServerValidator: Ajv;
}

// Initialize Server Validator
if (!globalThis.globalServerValidator) {
  const ajv = new Ajv();
  addFormats(ajv);
  addKeywords(ajv);

  const formats: MetaFormat[] = [
    nes.formatter,
    spw.formatter,
  ];

  for (const format of formats) {
    ajv.addFormat(format.name, {
      type: format.type,
      validate: format.validate,
    });
  }

  globalThis.globalServerValidator = ajv;
}

export interface ValidationResult {
  ok: boolean;
  messages: string[];
}

export function validate<T>(ajv: Ajv, object: T, schema: JSONSchemaType<T> | Schema): ValidationResult {
  const validator = ajv.compile(schema);

  const isValid = validator(object);
  if (!isValid) {
    return {
      ok: false,
      messages: ((validator.errors ?? []) as { message: string }[]).map((x) => x.message),
    };
  }

  return { ok: true, messages: [] };
}

export const ajv = globalThis.globalServerValidator;
