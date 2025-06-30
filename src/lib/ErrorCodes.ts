export enum ErrorCodes {
  OK = 0,

  /**
   * Represents a generic error to be used for catch blocks
   */
  GENERIC_ERROR = 4321,

  /**
   * Represents a specific error code indicating that the provided ID is not valid.
   */

  INVALID_ID = 4322,

  /**
   * Represents a specific error code indicating that a recovery operation has failed.
   *
   * This constant can be used to identify and handle scenarios where recovery processes,
   * such as data restoration or state recovery, do not complete successfully.
   * It is typically used for error tracking, debugging, or triggering appropriate
   * fallback mechanisms in an application.
   */
  RECOVERY_FAILED = 3419,

  /**
   * A constant variable representing the specific error code when no account is found.
   * This code is typically used to signify that an attempted operation has failed
   * because the account associated with the given identifier or criteria does not exist.
   */
  NO_ACCOUNT_FOUND = 3420,

  /**
   * Represents the error code for a failure in sending mail.
   * This constant is typically used to signify that an attempt
   * to send an email has failed due to an error.
   */
  MAIL_SEND_FAILURE = 3421,

  /**
   * Represents the error code for an account not found scenario.
   * This error code is typically used when an operation is attempted
   * on an account that does not exist or cannot be located in the system.
   */
  ACCOUNT_NOT_FOUND = 69419,

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

  /**
   * Represents the status code indicating that the dashboard data fetch
   * has failed.
   * 
   * This can occur in scenarios where the user account does not exist
   * or the given user id is somehow not valid.
   */
  DASHBOARD_ID_ERROR = 9000,

  /**
   * Represents a code or identifier for a dashboard failure event.
   * This constant is used to indicate that a dashboard process has failed
   * in the application logic. The value can be used for error handling,
   * logging, or debugging purposes.
   */
  DASHBOARD_FAILURE = 9005,

  /**
   * Represent the status code for indicating that the equipment id provided
   * is invalid.
   * 
   * The value can be used for error handling, logging, or debugging purposes.
   */
  EQUIPMENT_ID_ERROR = 8080,

  /**
   * Represents the status code for indicating that the equipment is not found
   * or does not exist.
   * 
   * The value can be used for error handling, logging, or debugging purposes.
   */
  EQUIPMENT_NOT_FOUND = 40000,

  /**
   * Represents the status code for indicating that the equipment creation
   * process has failed.
   */
  EQUIPMENT_CREATION_ERROR = 13579,

  /**
   * Represents the status code for indicating that the equipment update
   * process has failed.
   */
  EQUIPMENT_UPDATE_ERROR = 13580,
}