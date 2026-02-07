export type RsvpRecord = {
  id: string;
  name: string;
  phone: string;
  guests_count: number;
  attending: boolean;
  dietary?: string | null;
  message?: string | null;
  created_at: string;
  updated_at: string;
};

const memoryStore: RsvpRecord[] = [];

export const memoryRsvpStore = {
  list: async () => memoryStore,
  create: async (payload: Omit<RsvpRecord, 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const record: RsvpRecord = {
      ...payload,
      created_at: now,
      updated_at: now
    };
    memoryStore.push(record);
    return record;
  },
  update: async (id: string, payload: Partial<RsvpRecord>) => {
    const index = memoryStore.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }
    const updated = {
      ...memoryStore[index],
      ...payload,
      updated_at: new Date().toISOString()
    };
    memoryStore[index] = updated;
    return updated;
  },
  get: async (id: string) => memoryStore.find((item) => item.id === id) ?? null
};
