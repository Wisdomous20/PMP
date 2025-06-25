export enum ErrorCodes {
  OK = 0,

  /**
   * Represents the error code for a failure in sending mail.
   * This constant is typically used to signify that an attempt
   * to send an email has failed due to an error.
   */
  MAIL_SEND_FAILURE = 3421,

  /**
   * A constant representing a specific numeric code for the scenario where
   * an account already exists and cannot be created again.
   * Typically used in error handling or validation processes to indicate
   * the duplication of account-related data.
   */
  ACCOUNT_ALREADY_EXISTS = 69420,

  /**
   * Represents a code or identifier for a registration failure event.
   * This constant is used to indicate that a registration process has failed
   * in the application logic. The value can be used for error handling,
   * logging, or debugging purposes.
   */
  REGISTRATION_FAILURE = 69421,

  /**
   * Represents the status code indicating that the registration process
   * has been completed successfully, but the attempt to send a confirmation
   * or notification email has failed.
   *
   * This can occur in scenarios where the user account is created, and
   * their details are saved correctly, but the email service or related
   * functionality encounters an issue.
   */
  REGISTRATION_SUCCESS_BUT_MAIL_SEND_FAILURE = 69422,
}