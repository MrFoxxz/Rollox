import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expanded: false,
  activeTab: 'rolls', // 'rolls' | 'turns' | 'messages'
  announcements: [], 
};

const toolkitSlice = createSlice({
  name: 'toolkit',
  initialState,
  reducers: {
    toggleExpanded: (state) => {
      state.expanded = !state.expanded;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    sendAnnouncement: (state, action) => {
      // action.payload: { title, message, type, authorId, authorRole, audience }
      const newAnnouncement = {
        id: 'ann-' + Date.now(),
        createdAt: new Date().toISOString(),
        isRead: false,
        ...action.payload,
      };
      state.announcements.unshift(newAnnouncement);
      // Limit to last 20 announcements
      if (state.announcements.length > 20) {
        state.announcements.pop();
      }
    },
    markAnnouncementAsRead: (state, action) => {
      const announcement = state.announcements.find(a => a.id === action.payload);
      if (announcement) {
        announcement.isRead = true;
      }
    },
    clearAnnouncements: (state) => {
      state.announcements = [];
    }
  }
});

export const { 
  toggleExpanded, 
  setActiveTab, 
  sendAnnouncement, 
  markAnnouncementAsRead, 
  clearAnnouncements 
} = toolkitSlice.actions;

export default toolkitSlice.reducer;
