import { get, set } from 'idb-keyval';
export interface TreeData {
  id: string; // Draft ID
  step1?: { species: string; location: string; date: string };
  step2?: { totalHeight: string; firstBranchHeight: string; dap: string };
  step3?: { state: string; balance: string; structureIssue: string };
  step4?: { pestType: string; intensity: string; affectedPart: string };
  step5?: { indicators: string[]; diversity: string };
  step6?: { states: string[]; intensity: string };
  step7?: { electricalWiring: string };
  step8?: { managementType: string; urgency: string };
  photos?: string[]; // Array of base64 strings or Object URLs
  lastModified: number;
}

const DRAFT_KEY = 'tree-registration-draft';

export const saveDraft = async (data: Partial<TreeData>) => {
  try {
    const existing = await get<TreeData>(DRAFT_KEY) || { id: crypto.randomUUID(), lastModified: Date.now() };
    const merged = { ...existing, ...data, lastModified: Date.now() };
    await set(DRAFT_KEY, merged);
    return merged;
  } catch (error) {
    console.warn('Failed to save to idb', error);
  }
};

export const getDraft = async (): Promise<TreeData | undefined> => {
  try {
    return await get<TreeData>(DRAFT_KEY);
  } catch (error) {
    console.warn('Failed to read idb', error);
  }
};

export const clearDraft = async () => {
  try {
    await set(DRAFT_KEY, null);
  } catch (error) {
    console.warn('Failed to clear idb', error);
  }
};
