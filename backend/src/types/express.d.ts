import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      role: UserRole;
      country?: string | null;
      age?: number | null;
      createdAt: Date;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
