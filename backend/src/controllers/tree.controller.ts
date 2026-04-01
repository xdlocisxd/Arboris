import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../server';

export const syncTrees = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { trees } = req.body;
  console.log('Incoming trees for sync:', JSON.stringify(trees, null, 2));
  
  if (!Array.isArray(trees)) {
    return res.status(400).json({ error: 'Expected trees array' });
  }

  let synced = 0;
  
  try {
    for (const tree of trees) {
      console.log('Processing tree:', tree.step1?.species);
      // Create record
      const created = await prisma.tree.create({
        data: {
          species: tree.step1?.species || 'Unknown',
          locationName: tree.step1?.location || '',
          dateField: tree.step1?.date || '',
          totalHeight: tree.step2?.totalHeight ? parseFloat(tree.step2.totalHeight) : null,
          firstBranchHeight: tree.step2?.firstBranchHeight ? parseFloat(tree.step2.firstBranchHeight) : null,
          dap: tree.step2?.dap ? parseFloat(tree.step2.dap) : null,
          generalState: tree.step3?.state,
          hasBalance: tree.step3?.balance,
          structureIssue: tree.step3?.structureIssue,
          pestType: tree.step4?.pestType,
          pestIntensity: tree.step4?.intensity,
          affectedPart: tree.step4?.affectedPart,
          ecologyIndicators: tree.step5 || {},
          phenology: tree.step6 || {},
          electricalWiring: tree.step7?.electricalWiring,
          managementType: tree.step8?.managementType,
          urgency: tree.step8?.urgency,
          userId: req.user.id
        }
      });
      
      // If we had GPS coords from the frontend, we would run a raw PostGIS update here:
      // if (tree.lng && tree.lat) {
      //   await prisma.$executeRaw`
      //     UPDATE "Tree" SET coordinates = ST_SetSRID(ST_MakePoint(${tree.lng}, ${tree.lat}), 4326)
      //     WHERE id = ${created.id};
      //   `;
      // }
      synced++;
    }

    res.json({ message: 'Sync successful', synced });
  } catch (error: any) {
    console.error('SERVER ERROR IN SYNC:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export const getTrees = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const trees = await prisma.tree.findMany({
      where: { userId: req.user.id }
    });
    res.json({ trees });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTreeById = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;

  try {
    const tree = await prisma.tree.findFirst({
      where: { id, userId: req.user.id }
    });
    if (!tree) return res.status(404).json({ error: 'Tree not found' });
    res.json({ tree });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
