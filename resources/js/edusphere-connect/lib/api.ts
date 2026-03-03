const API_BASE_URL = '/api/v1';

export const api = {
  async getSchools() {
    const response = await fetch(`${API_BASE_URL}/schools`);
    return response.json();
  },
  
  async getStudents() {
    const response = await fetch(`${API_BASE_URL}/students`);
    return response.json();
  },
  
  // Ajoutez d'autres méthodes selon vos besoins
};