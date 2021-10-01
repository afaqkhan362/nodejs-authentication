export const PASSWORD_NOT_MATCHED = {
  errorCode: 'Authenticate_0000001',
  getErrorMessage: (data?: any) =>
    `Password and Confirm Password did not match`,
};

export const ACCOUNT_CREATION_FAILED = {
  errorCode: 'Authenticate_0000002',
  getErrorMessage: (data?: any) =>
    `Unable to create account for user for this email`,
};

export const USER_CREATION_FAILED = {
  errorCode: 'Authenticate_0000003',
  getErrorMessage: (data?: any) =>
    `Unable to create user profile for user with this userid`,
};

export const ACCOUNT_ALREADY_EXISTS = {
  errorCode: 'Authenticate_0000004',
  getErrorMessage: (data?: any) =>
    `Account already exists for email`,
};

export const USER_DOES_NOT_EXIST = {
  errorCode: 'Authenticate_0000005',
  getErrorMessage: (data?: any) => `Account doesn't exist.`,
};

export const INCORRECT_PASSWORD = {
  errorCode: 'Authenticate_0000006',
  getErrorMessage: (data?: any) => `Password Incorrect`,
};
