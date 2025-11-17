import { prisma } from './prisma';

/**
 * Get all access tags for a user in a tenant
 */
export async function getUserTags(userId: string, tenantId: string): Promise<string[]> {
  try {
    const tenantMember = await prisma.tenantMember.findFirst({
      where: {
        userId,
        tenantId,
      },
      include: {
        tags: true, // Direct access to tags with implicit many-to-many
      },
    });

    if (!tenantMember) {
      return [];
    }

    return tenantMember.tags.map(tag => tag.name);
  } catch (error) {
    console.error('Error getting user tags:', error);
    return [];
  }
}

/**
 * Get all tag IDs for a user in a tenant
 */
export async function getUserTagIds(userId: string, tenantId: string): Promise<string[]> {
  try {
    const tenantMember = await prisma.tenantMember.findFirst({
      where: {
        userId,
        tenantId,
      },
      include: {
        tags: true, // Direct access to tags with implicit many-to-many
      },
    });

    if (!tenantMember) {
      return [];
    }

    return tenantMember.tags.map(tag => tag.id);
  } catch (error) {
    console.error('Error getting user tag IDs:', error);
    return [];
  }
}

/**
 * Check if a user can access a document based on tags
 * User can access if:
 * 1. User is an admin (can access all documents)
 * 2. Document has no access tags (accessible to all)
 * 3. User has at least one tag that matches document's access tags
 */
export async function canUserAccessDocument(
  userId: string,
  tenantId: string,
  documentId: string
): Promise<boolean> {
  try {
    // Check if user is admin first
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId,
        tenantId,
      },
      select: {
        role: true,
        isOwner: true,
      },
    });

    // Admins can access all documents
    if (userMembership && (userMembership.role === 'ADMIN' || userMembership.isOwner)) {
      return true;
    }

    // Get document with its access tags
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        tenantId,
      },
      include: {
        accessTags: true, // Direct access to tags with implicit many-to-many
      },
    });

    if (!document) {
      return false;
    }

    // If document has no access tags, it's accessible to all users in the tenant
    if (document.accessTags.length === 0) {
      return true;
    }

    // Get user's tags
    const userTagIds = await getUserTagIds(userId, tenantId);

    // Check if user has at least one matching tag
    const documentTagIds = document.accessTags.map(tag => tag.id);
    return documentTagIds.some(tagId => userTagIds.includes(tagId));
  } catch (error) {
    console.error('Error checking document access:', error);
    return false;
  }
}

/**
 * Filter document IDs by user access tags
 * Returns array of document IDs that the user can access
 * Admins can access all documents
 */
export async function filterDocumentsByUserAccess(
  userId: string,
  tenantId: string,
  documentIds: string[]
): Promise<string[]> {
  try {
    if (documentIds.length === 0) {
      return [];
    }

    // Check if user is admin first
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId,
        tenantId,
      },
      select: {
        role: true,
        isOwner: true,
      },
    });

    // Admins can access all documents - return all document IDs
    if (userMembership && (userMembership.role === 'ADMIN' || userMembership.isOwner)) {
      return documentIds;
    }

    // Get user's tag IDs
    const userTagIds = await getUserTagIds(userId, tenantId);

    // Get all documents with their access tags
    const documents = await prisma.document.findMany({
      where: {
        id: { in: documentIds },
        tenantId,
      },
      include: {
        accessTags: true, // Direct access to tags with implicit many-to-many
      },
    });

    // Filter documents
    const accessibleDocumentIds = documents
      .filter(doc => {
        // If document has no access tags, it's accessible to all
        if (doc.accessTags.length === 0) {
          return true;
        }

        // Check if user has at least one matching tag
        const docTagIds = doc.accessTags.map(tag => tag.id);
        return docTagIds.some(tagId => userTagIds.includes(tagId));
      })
      .map(doc => doc.id);

    return accessibleDocumentIds;
  } catch (error) {
    console.error('Error filtering documents by user access:', error);
    return [];
  }
}

/**
 * Get Prisma where clause to filter documents by user tags
 * Use this in Prisma queries to filter documents
 * Admins can access all documents (returns only tenantId filter)
 */
export async function getDocumentAccessWhereClause(
  userId: string,
  tenantId: string
): Promise<any> {
  try {
    // Check if user is admin first
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId,
        tenantId,
      },
      select: {
        role: true,
        isOwner: true,
      },
    });

    // Admins can access all documents - return only tenant filter
    if (userMembership && (userMembership.role === 'ADMIN' || userMembership.isOwner)) {
      return {
        tenantId,
      };
    }

    const userTagIds = await getUserTagIds(userId, tenantId);

    // If user has no tags, they can only access documents with no access tags
    if (userTagIds.length === 0) {
      return {
        tenantId,
        OR: [
          { accessTags: { none: {} } }, // Documents with no access tags
        ],
      };
    }

    // User can access documents that:
    // 1. Have no access tags (accessible to all)
    // 2. Have at least one tag matching user's tags
    return {
      tenantId,
      OR: [
        { accessTags: { none: {} } }, // Documents with no access tags
        { accessTags: { some: { id: { in: userTagIds } } } }, // Documents with matching tags
      ],
    };
  } catch (error) {
    console.error('Error getting document access where clause:', error);
    // Fallback: return only documents with no access tags
    return {
      tenantId,
      accessTags: { none: {} },
    };
  }
}

