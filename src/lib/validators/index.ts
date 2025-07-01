import { DateTime } from "luxon";
import * as v from "validator";

export type ValidationErrors<T> = Record<keyof T, {
  /**
   * A string variable that represents the error message from the Validator function
   */
  message: string;

  /**
   * Specifies the origin of the error where the check fails.
   */
  from: "type-check" | "formatter" | "is-required" | "unvalidated";
}>;

export interface ValidationResult<T> {
  /**
   * Validation Result if Passing or Not.
   */
  ok: boolean;

  /**
   * Validation Errors
   */
  errors: ValidationErrors<T>
}

/**
 * Represents a function used for validating a value of a specific type.
 *
 * This function type accepts a value of type `T` and performs validation on it.
 * The validation process is asynchronous and returns a Promise resolving to
 * an object containing the validation result.
 *
 * @template T The type of the value to be validated.
 * @typedef {function} ValidationFunction
 * @param {T} value The value to validate.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export type ValidationFunction<T> = (value: T) => Promise<{ ok: boolean, error?: string }>

/**
 * Represents the possible validation types that can be used for input or data validation.
 *
 * ValidationTypes define the type of data expected and allow for type-specific validation.
 *
 * Possible values include:
 * - "string": Represents a text-based value.
 * - "number": Represents a numeric value, either integer or floating-point.
 * - "boolean": Represents a true or false value.
 * - "date": Represents a date object or value.
 * - "array": Represents a collection of elements organized in a sequential format.
 * - "object": Represents a structured collection of key-value pairs.
 */
export type ValidationTypes = "string" | "number" | "boolean" | "date" | "array" | "object";

export interface Schema<T> {
  /**
   * List of all properties to be validated
   */
  properties: {
    [K in keyof T]: {
      /**
       * The Instance Type of the Property
       */
      type: ValidationTypes;

      /**
       * The Formatter to use for validation if the current property represents a format
       * like an email or phone number.
       *
       * The value of the formatter is specific for each instance type.
       * @remarks If formatterFn is defined, this will be ignored.
       */
      formatter?: string;

      /**
       * Custom formatter function.
       */
      formatterFn?: ValidationFunction<T[K]>;

      /**
       * Represents the minimum allowable value.
       * This is an optional property that defines the lower bound for a numeric range or value.
       * If undefined, no minimum constraint is applied.
       *
       * @remarks This will only work if type is string, number and date.
       * @remarks If type is string, this will check the minimum length of the string.
       * @remarks If type is number, this will check the minimum value
       * @remarks If type is date, this will check the minimum DateTime allowed.
       */
      min?: number | DateTime;

      /**
       * Represents the maximum value or upper limit that can be assigned or processed.
       * The value is optional and may remain undefined if not explicitly specified.
       * Commonly used for setting constraints or boundaries in calculations or validations.
       *
       * @remarks This will only work if type is string, number and date.
       * @remarks If type is string, this will check the maximum length of the string.
       * @remarks If type is number, this will check the maximum value
       * @remarks If type is date, this will check the maximum DateTime allowed.
       */
      max?: number | DateTime;
    }
  }

  /**
   * List of all property names that should be required.
   */
  requiredProperties: Array<keyof T>;

  /**
   * Allow this object to have properties that aren't validated.
   */
  allowUnvalidatedProperties?: boolean;
}

export interface ValidatorFormatterMetaData<T extends ValidationTypes> {
  /**
   * The target type of the formatter.
   */
  forType: T;

  /**
   * Main Formatter function
   */
  formatterFn: ValidationFunction<T>;
}

interface MinMaxValidator {
  ok: boolean;
  error?: string;
}

/**
 * Defines the maximum length allowed for a name.
 * This constant specifies the upper limit on the number
 * of characters that can be used for a name, ensuring consistency
 * and preventing overflow or truncation in name-related operations.
 *
 * @constant {number} NAME_MAXIMUM_LENGTH
 */
const NAME_MAXIMUM_LENGTH = 50;

/**
 * Represents the maximum allowable length for a local number.
 *
 * This value is typically used to enforce constraints on the
 * length of locally scoped numeric identifiers or phone numbers.
 *
 * @constant {number} LOCAL_NUMBER_MAXIMUM_LENGTH
 */
const LOCAL_NUMBER_MAXIMUM_LENGTH = 11;

/**
 * Represents the maximum allowed length for a cellphone number.
 * This constant defines the upper limit for the total number of characters
 * that a valid cellphone number can contain, ensuring consistency and compliance
 * with formatting rules or standards.
 *
 * @constant {number} CELLPHONE_NUMBER_MAXIMUM_LENGTH
 */
const CELLPHONE_NUMBER_MAXIMUM_LENGTH = 15;

/**
 * Represents the maximum allowable length for a password.
 * This variable defines the upper limit for the number of characters
 * a password can contain to ensure compliance with security
 * and application constraints.
 *
 * @constant {number} PASSWORD_MAXIMUM_LENGTH
 */
const PASSWORD_MAXIMUM_LENGTH = 100;

/**
 * Defines the maximum allowable length for an email address.
 * This constant is used to ensure that email input fields and
 * validations adhere to the specified maximum character limit.
 *
 * @constant {number} EMAIL_MAXIMUM_LENGTH
 */
const EMAIL_MAXIMUM_LENGTH = 100;

class BootlegValidator {
  private readonly _formatters: Record<string, ValidatorFormatterMetaData<ValidationTypes>> = {};

  constructor() {
    // Name formatter
    this.addFormat("ascii-names", {
      forType: "string",
      formatterFn: async (value) => {
        if (v.isEmpty(value)) {
          return {
            ok: false,
            error: "Name cannot be empty"
          }
        }

        if (value.length > NAME_MAXIMUM_LENGTH) {
          return {
            ok: false,
            error: `Name cannot be longer than ${NAME_MAXIMUM_LENGTH} characters`
          }
        }

        // Matcher
        const regex = /^\p{L}[\p{L}\s'-]*$/u
        if (!regex.test(value)) {
          return {
            ok: false,
            error: "Name may only include letters (including ñ, é, etc.), spaces, hyphens or apostrophes."
          }
        }

        return { ok: true }
      }
    });

    // Non-empty string formatter
    this.addFormat("non-empty-string", {
      forType: "string",
      formatterFn: async (value) => {
        if (v.isEmpty(value)) {
          return {
            ok: false,
            error: "Value cannot be empty"
          }
        }

        return { ok: true }
      }
    });

    // Local Number formatter
    this.addFormat("local-number", {
      forType: "string",
      formatterFn: async (value) => {
        // Optional Property
        if (v.isEmpty(value)) {
          return { ok: true }
        }

        if (!v.isNumeric(value)) {
          return {
            ok: false,
            error: "Local number must contain only numbers."
          }
        }

        const cond = !(v.isLength(value, { min: 7, max: LOCAL_NUMBER_MAXIMUM_LENGTH })
          || v.isLength(value, { min: 4, max: 4 }));
        if (cond) {
          return {
            ok: false,
            error: `Local number must be 4 digits or between 7 and ${LOCAL_NUMBER_MAXIMUM_LENGTH} digits.`
          }
        }

        return { ok: true }
      }
    });

    // Cellphone Number formatter
    this.addFormat("cellphone-number", {
      forType: "string",
      formatterFn: async (value) => {
        if (v.isEmpty(value)) {
          return {
            ok: false,
            error: "Cellphone number is required."
          }
        }

        const phoneNumberRegex = /(\+63|0)(\d{2,4}-?\d{3,4}-?\d{4})/;
        if (!phoneNumberRegex.test(value)) {
          return {
            ok: false,
            error: "Please enter a valid cellphone number.",
          };
        }

        if (value.length > CELLPHONE_NUMBER_MAXIMUM_LENGTH) {
          return {
            ok: false,
            error: `Cellphone number cannot be longer than ${CELLPHONE_NUMBER_MAXIMUM_LENGTH} characters.`
          };
        }

        return { ok: true };
      }
    });

    // Strong password formatter
    this.addFormat("strong-password", {
      forType: "string",
      formatterFn: async (value) => {
        if (v.isEmpty(value)) {
          return {
            ok: false,
            error: "Password is required."
          }
        }

        if (value.length > PASSWORD_MAXIMUM_LENGTH) {
          return {
            ok: false,
            error: `Password cannot be longer than ${PASSWORD_MAXIMUM_LENGTH} characters.`
          }
        }

        if (!v.isStrongPassword(value)) {
          return {
            ok: false,
            error: "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character."
          }
        }

        return { ok: true }
      }
    });

    // CPU email formatter
    this.addFormat("cpu-email", {
      forType: "string",
      formatterFn: async (value) => {
        if (v.isEmpty(value)) {
          return {
            ok: false,
            error: "Email is required."
          }
        }

        if (value.length > EMAIL_MAXIMUM_LENGTH) {
          return {
            ok: false,
            error: `Email cannot be longer than ${EMAIL_MAXIMUM_LENGTH} characters.`
          }
        }

        if (!v.isEmail(value) || !value.endsWith("@cpu.edu.ph")) {
          return {
            ok: false,
            error: "Please enter a valid CPU email address."
          };
        }

        return { ok: true };
      }
    });
  }

  /**
   * Adds a new format to the internal list of formatters.
   *
   * @param {string} name - The name of the format to be added. Must be unique.
   * @param {ValidatorFormatterMetaData<ValidationTypes>} metadata - The metadata associated with the specified format.
   * @return {void} This method does not return a value.
   */
  addFormat(name: string, metadata: ValidatorFormatterMetaData<ValidationTypes>) {
    // Do not accept if the same name of formatter already exists
    if (this._formatters[name]) {
      return;
    }

    this._formatters[name] = { ...metadata };
  }

  /**
   * Retrieves the formatter function associated with the provided name and validation type.
   *
   * @template T
   * @param {ValidationTypes} typeOf - The type of validation the formatter is associated with.
   * @param {string} name - The name of the formatter to retrieve.
   * @return {ValidationFunction<T> | null} The formatter function if found and matched with the validation type; otherwise, null.
   */
  getFormatterFunction<T>(typeOf: ValidationTypes, name: string): ValidationFunction<T> | null {
    // Get the name of the registered formatter.
    const formatter = this._formatters[name];
    if (!formatter) {
      return null;
    }

    // Don't allow mismatched types be used for formatter
    if (formatter.forType !== typeOf) {
      return null;
    }

    return formatter.formatterFn as ValidationFunction<T>;
  }

  /**
   * Checks if the provided value matches the specified validation type.
   *
   * @param type The validation type to check against.
   * @param value The value to validate.
   * @return Returns true if the value matches the specified type, otherwise false.
   */
  private isTypeMatches<T>(type: ValidationTypes, value: T): boolean {
    // Check if the property is a type of Array
    if (type === "array") {
      return Array.isArray(value);
    }

    // Check if the type is Date
    if (type === "date") {
      return (value instanceof Date) && value.toString() !== "Invalid Date";
    }

    // Check if the type is Number
    if (type === "number") {
      return (typeof value === "number") && !isNaN(value);
    }

    // Other types
    return typeof value === type
  }

  /**
   * Checks whether the provided value is neither `undefined` nor `null`.
   *
   * @template T
   * @param {T} value - The value to check for existence.
   * @return {boolean} Returns `true` if the value is not `undefined` and not `null`, otherwise `false`.
   */
  private isExist<T>(value: T): boolean {
    return value !== undefined && value !== null;
  }

  /**
   * Checks if the given value satisfies the specified minimum and/or maximum constraints
   * based on its type (string or number).
   *
   * @param type The type of the value to validate. Allowed values are "string" or "number".
   * @param value The value to validate against the min and max constraints.
   * @param min The optional minimum threshold for the value. For strings, it represents the minimum length.
   * @param max The optional maximum threshold for the value. For strings, it represents the maximum length.
   * @return Returns true if the value complies with the specified min and max constraints, or if the type is unsupported. Returns false otherwise.
   */
  private checkMinMax<T>(type: ValidationTypes, value: T, min?: number, max?: number): MinMaxValidator {
    // Unsupported types get a free pass.
    if (type !== "string" && type !== "number") {
      return { ok: true };
    }

    // Check for minimum values
    if (this.isExist(min)) {
      const minValue = min as number;

      // Check for minimum length if type is string.
      if (type === "string") {
        if ((value as string).length < minValue) {
          return {
            ok: false,
            error: `Value must be at least ${minValue} characters long.`
          };
        }
      }

      // Check for minimum value if type is number.
      if (type === "number") {
        if ((value as number) < minValue) {
          return {
            ok: false,
            error: `Value must be at least ${minValue}.`
          }
        }
      }
    }

    // Check for maximum values
    if (this.isExist(max)) {
      const maxValue = max as number;

      if (type === "string") {
        if ((value as string).length > maxValue) {
          return {
            ok: false,
            error: `Value cannot be longer than ${maxValue} characters.`
          }
        }
      }

      // Check for minimum value if type is number.
      if (type === "number") {
        if ((value as number) > maxValue) {
          return {
            ok: false,
            error: `Value cannot be longer than ${maxValue}.`
          }
        }
      }
    }

    return { ok: true };
  }

  /**
   * Validates whether a given date value falls within specified minimum and maximum date boundaries.
   *
   * @param {ValidationTypes} type The type of validation. This method checks only when the type is "date".
   * @param {Date} value The date value to validate.
   * @param {DateTime} [min] The minimum allowed date. Optional.
   * @param {DateTime} [max] The maximum allowed date. Optional.
   * @return {MinMaxValidator} An object indicating whether the validation was successful (ok: true) or failed (ok: false with an error message).
   */
  private checkMinMaxDate(type: ValidationTypes, value: Date, min?: DateTime, max?: DateTime): MinMaxValidator {
    // Pass if not date. Nothing to check.
    if (type !== "date") {
      return { ok: true };
    }

    if (this.isExist(min)) {
      const minValue = min as DateTime;
      const date = DateTime.fromJSDate(value);

      if (date < minValue) {
        return {
          ok: false,
          error: `Value must be at least ${minValue.toISO()}.`
        }
      }
    }

    if (this.isExist(max)) {
      const maxValue = max as DateTime;
      const date = DateTime.fromJSDate(value);

      if (date > maxValue) {
        return {
          ok: false,
          error: `Value cannot be greater than ${maxValue.toISO()}.`
        }
      }
    }

    return { ok: true };
  }

  /**
   * Validates an object against a specified validation schema and returns the validation result.
   *
   * @param object The object to validate against the schema.
   * @param schema The validation schema defining properties, requirements, and rules for the object.
   * @return A promise that resolves to a `ValidationResult` indicating whether the object passed validation and any validation errors.
   */
  async validate<T extends object>(object: T, schema: Schema<T>): Promise<ValidationResult<T>> {
    // Check if any of the properties are not part of the validation
    if (!schema.allowUnvalidatedProperties) {
      const validatedProperties = Object.keys(schema.properties);
      const objectProperties = Object.keys(object);

      // Find those properties that are NOT part of the validation.
      if (validatedProperties.length !== objectProperties.length) {
        const result: ValidationResult<T> = {
          ok: false,
          errors: {} as ValidationErrors<T>,
        }

        for (const extraProperty of objectProperties.filter(x => !validatedProperties.includes(x))) {
          result.errors[extraProperty as keyof T] = {
            message: `Property ${String(extraProperty)} is not allowed without validation.`,
            from: "unvalidated",
          } as ValidationErrors<T>[keyof T];
        }

        return result;
      }
    }

    // Check for types and formatters of each property
    for (const property in schema.properties) {
      const current = schema.properties[property];

      // Fail when one of the properties is not present especially if its part of the
      // required properties
      if (!this.isExist(object[property]) && schema.requiredProperties.includes(property as keyof T)) {
        return {
          ok: false,
          errors: {
            [property]: {
              message: `Property ${String(property)} is required`,
              from: "is-required"
            }
          } as ValidationErrors<T>
        }
      }

      // Continue when the property is not present. It is already checked above that if the
      // schema.allowUnvalidatedProperties is false, it will check each property present in the
      // schema.
      if (!this.isExist(object[property])) {
        continue;
      }

      // Assert the type must be equal
      if (!this.isTypeMatches(current.type, object[property])) {
        return {
          ok: false,
          errors: {
            [property]: {
              message: `Property ${String(property)} must be of type ${current.type}`,
              from: "type-check"
            }
          } as ValidationErrors<T>
        }
      }

      // Range checks
      if (current.type === "string" || current.type === "number") {
        const minMaxCheck = this
          .checkMinMax(current.type, object[property], current.min as number, current.max as number);
        if (!minMaxCheck.ok) {
          return {
            ok: false,
            errors: {
              [property]: {
                message: minMaxCheck.error!,
                from: "range-check"
              }
            } as ValidationErrors<T>
          }
        }
      }

      if (current.type === "date") {
        const dateMinMax = this
          .checkMinMaxDate(current.type, object[property] as Date, current.min as DateTime, current.max as DateTime);
        if (!dateMinMax.ok) {
          return {
            ok: false,
            errors: {
              [property]: {
                message: dateMinMax.error!,
                from: "range-check"
              }
            } as ValidationErrors<T>
          }
        }
      }

      // Custom formatter
      if (current.formatterFn) {
        // Run the custom formatter
        const runFormatter = await current.formatterFn(object[property]);
        if (!runFormatter.ok) {
          return {
            ok: false,
            errors: {
              [property]: {
                message: runFormatter.error,
                from: "formatter"
              }
            } as ValidationErrors<T>
          }
        }

        return { ok: true, errors: {} as ValidationErrors<T> }
      }

      // Built-in formatter options
      if (current.formatter) {
        const formatter = this._formatters[current.formatter];

        // Bail when formatter doesn't exist.
        if (!formatter) {
          return {
            ok: false,
            errors: {
              [property]: {
                message: `Property ${String(property)} has an invalid formatter`,
                from: "formatter"
              }
            } as ValidationErrors<T>
          }
        }

        const formatterResult = await formatter
          .formatterFn(object[property as keyof T] as ValidationTypes);
        if (!formatterResult.ok) {
          return {
            ok: false,
            errors: {
              [property]: {
                message: formatterResult.error,
                from: "formatter"
              }
            } as ValidationErrors<T>
          }
        }
      }
    }

    return { ok: true, errors: {} as ValidationErrors<T> }
  }

  toPlainErrors<T>(errors: ValidationErrors<T>): string {
    const str = [];
    for (const key in errors) {
      str.push(`${key}: ${errors[key].message} (in: ${errors[key].from})`);
    }
    return str.join(", ");
  }
}

declare global {
  var globalValidators: BootlegValidator;
}

const validator = globalThis.globalValidators || new BootlegValidator();
globalThis.globalValidators = validator;

export default validator;
