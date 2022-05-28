import bcrypt, { hash } from "bcrypt";

const hashPassword = (password: string, salt: number): Promise<any> => {
  return bcrypt.hash(password, salt);
};

const comparePassword = (password, hashPassword): Promise<boolean> => {
  return bcrypt.compare(password, hashPassword);
};

export { hashPassword, comparePassword };
