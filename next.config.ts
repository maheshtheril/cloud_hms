import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  async redirects() {
    return [
      {
        source: '/dashboard/rbac/users',
        destination: '/settings/users',
        permanent: true,
      },
      {
        source: '/dashboard/rbac/roles',
        destination: '/settings/roles',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
