"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrees = exports.syncTrees = void 0;
const server_1 = require("../server");
const syncTrees = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const { trees } = req.body;
    if (!Array.isArray(trees)) {
        return res.status(400).json({ error: 'Expected trees array' });
    }
    let synced = 0;
    try {
        for (const tree of trees) {
            // Create record
            const created = await server_1.prisma.tree.create({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.syncTrees = syncTrees;
const getTrees = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const trees = await server_1.prisma.tree.findMany({
            where: { userId: req.user.id }
        });
        res.json({ trees });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTrees = getTrees;
