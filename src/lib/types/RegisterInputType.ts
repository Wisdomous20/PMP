export interface RegisterInputType {
  /**
   * First Name of the User
   */
  firstName: string;

  /**
   * Last Name of the User
   */
  lastName: string;

  /**
   * Local Telephone Number
   */
  localNumber: string;

  /**
   * Cellphone Number
   */
  cellphoneNumber: string;

  /**
   * Email
   * @remarks CPU email only
   */
  email: string;

  /**
   * Password
   */
  password: string;

  /**
   * Department where this User belongs to.
   */
  department: string;
}
