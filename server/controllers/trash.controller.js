import prisma from '../lib/prisma.js';

// Trash restore is complex with Prisma as we can't dynamically pick model
// We support restoring known collections
const COLLECTION_MAP = {
  'Property': 'property',
  'Unit': 'unit',
  'Contract': 'contract',
  'User': 'user',
  'Role': 'role',
  'Expense': 'expense',
  'Maintenance': 'maintenance',
};

export const restoreItem = async (req, res) => {
  try {
    const { id } = req.params;
    const trashItem = await prisma.trash.findUnique({ where: { id } });

    if (!trashItem) {
      return res.status(404).json({ message: 'Item not found in trash or has expired.' });
    }

    const modelKey = COLLECTION_MAP[trashItem.collectionName];
    if (!modelKey || !prisma[modelKey]) {
      return res.status(400).json({ message: 'Invalid or unsupported collection name.' });
    }

    // Remove the 'id' from the document to let DB assign or use existing
    const docData = { ...trashItem.document };

    // Restore using the appropriate Prisma model
    const restoredDoc = await prisma[modelKey].create({ data: docData });

    // Remove from trash
    await prisma.trash.delete({ where: { id } });

    res.json({ message: 'Item restored successfully', data: { ...restoredDoc, _id: restoredDoc.id } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
