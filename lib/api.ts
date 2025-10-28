import { prisma } from './prisma';
import { requireTenant, getCurrentUser } from './auth';

// API Client functions for data fetching
export const api = {
  // User related queries
  async getCurrentUser() {
    return await getCurrentUser();
  },

  // Tenant related queries
  async getCurrentTenant() {
    const { tenant } = await requireTenant();
    return tenant;
  },

  async getTenantUsers() {
    const { tenant } = await requireTenant();
    
    const users = await prisma.user.findMany({
      where: {
        tenants: {
          some: {
            tenantId: tenant.id,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImageUrl: true,
        createdAt: true,
        tenants: {
          where: {
            tenantId: tenant.id,
          },
          select: {
            role: true,
            isOwner: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map(user => ({
      ...user,
      role: user.tenants[0]?.role,
      isOwner: user.tenants[0]?.isOwner,
    }));
  },

  async getUserStats() {
    const { tenant } = await requireTenant();
    
    const userCount = await prisma.tenantMember.count({
      where: {
        tenantId: tenant.id,
      },
    });

    const recentUsers = await prisma.tenantMember.count({
      where: {
        tenantId: tenant.id,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    return {
      totalUsers: userCount,
      recentUsers,
    };
  },

  // Example: Add more API functions as needed
  async getDashboardData() {
    const { user, tenant } = await requireTenant();
    const userStats = await this.getUserStats();

    return {
      user,
      tenant,
      stats: userStats,
    };
  },
};
