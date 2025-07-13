import { fetchWithAuth } from "../utils/fetchWithAuth";

export interface User{
    username: string;
    name: string;
    email: string;
    roles: string[];
    age?: number | null;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
    height?: number | null;
    weight?: number | null;
    weightGoal?: number | null;
    availableEquipment: string[];
    trainings?: any[];
    trainingPlans?: any[];
    emailVerified?: boolean;
    verificationToken?: string | null;
}

const API_BASE_URL = 'http://localhost:8080';

export const getMyProfile = async (): Promise<User> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/profile`, {
        method: 'GET',
    });

    if(!res.ok){
        throw new Error('Failed to fetch user');
    }
    return await res.json();
}

export const updateMyProfile = async (data: User): Promise<User> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if(!res.ok){
        throw new Error('Failed to update user');
    }
    return await res.json();
}

export const getMyEquipment = async (): Promise<string[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/equipment`, {
        method: 'GET',
    });
    if(!res.ok){
        throw new Error('Failed to fetch equipment');
    }
    const data = await res.json();
    return data.availableEquipment ?? [];
}

export const updateMyEquipment = async (equipment: string[]): Promise<User> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/equipment`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({availableEquipment: equipment}),
    });
    if(!res.ok){
        throw new Error('Failed to update equipment');
    }
    return await res.json();
}

export const addEquipment = async (name: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/equipment/${name}`, {
        method: 'POST',
    });
    if (!res.ok){
        throw new Error('Failed to add equipment');
    }
};

export const removeEquipment = async(name: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/me/equipment/${name}`, {
        method: 'DELETE',
    });
    if (!res.ok){
        throw new Error('Failed to delete equipment');
    }
};

export const getAvailableEquipment = async (): Promise<Record<string, string>> => {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/equipment/available`);
  
  if (!res.ok){
    throw new Error('Could not fetch equipment');
  }
  const data = await res.json();
  return data.equipmentMap;
};
