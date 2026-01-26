export type JwtUserPayload = {
  id: number;
  role: "USER" | "ADMIN";
  email: string;
  username: string;
};
