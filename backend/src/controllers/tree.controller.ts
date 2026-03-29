import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../server';

export const syncTrees = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { trees } = req.body;
  
  if (!Array.isArray(trees)) {
    return res.status(400).json({ error: 'Expected trees array' });
  }

  let synced = 0;
  
  try {
    for (const tree of trees) {
      // Create record
      const created = await prisma.tree.create({
        data: {
          species: tree.step1?.species || 'Unknown',
          locationName: tree.step1?.location || '',
          dateField: tree.step1?.date || '',
          totalHeight: tree.step2?.totalHeight,
          firstBranchHeight: tree.step2?.firstBranchHeight,
          dap: tree.step2?.dap,
          generalState: tree.step3?.state,
          hasBalance: tree.step3?.balance,
          structureIssue: tree.step3?.structureIssue,
          pestType: tree.step4?.pestType,
          pestIntensity: tree.step4?.intensity,
          affectedPart: tree.step4?.affectedPart,
          injuryType: tree.step5?.injuryType,
          ecologyIndicators: tree.step5?.ecologyIndicators,
          phenology: tree.step5?.phenology,
          electricalWiring: tree.step6?.electricalWiring,
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
    res.status(500).json({ error: error.message });
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
