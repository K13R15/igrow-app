import axios from 'axios';

const BASE_URL = 'http://your-esp32-ip'; // Replace with your ESP32's IP address

export const scheduleService = {
  async createSchedule(schedule) {
    try {
      const response = await axios.post(`${BASE_URL}/schedule`, schedule);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  async getSchedules() {
    try {
      const response = await axios.get(`${BASE_URL}/schedules`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },

  async updateSchedule(id, isActive) {
    try {
      const response = await axios.put(`${BASE_URL}/schedule/${id}`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },
};