declare global {
  // This prevents the client from being recreated on hot reloads in development
  // in Next.js or similar environments
  namespace NodeJS {
    interface Global {
      prismaGlobal: PrismaClient | undefined;
    }
  }
}
export {};
