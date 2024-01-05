import * as bcrypt from 'bcrypt';

export const hash = async (password: string): Promise<string> => {
  const saltRounds = 10;

  return await bcrypt.hash(password, saltRounds);
};

export const compare = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};
