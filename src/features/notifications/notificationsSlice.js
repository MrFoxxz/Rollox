import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [] // Array of { id, type, sessionId, actorName, actorRole, message, createdAt, read }
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // action.payload: { type, sessionId, actorName, actorRole, message }
      const newNotification = {
        ...action.payload,
        id: 'notif-' + Date.now() + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
        read: false
      };
      state.notifications.unshift(newNotification);
      
      // Keep only last 30 notifications (Activity Sensor)
      if (state.notifications.length > 30) {
        state.notifications.pop();
      }
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
