// src/core/data/statuses.js
// Seed data for contacts' status updates, shown on the Status/Updates screen.
// `seenCount` tracks how many of `slides` the current user has viewed so far.

export const contactStatuses = [
  {
    id: 'u1',
    name: 'Nabeel (Work)',
    image: 'https://ui-avatars.com/api/?name=Nabeel+Work&background=075e54&color=fff',
    totalSlides: 3,
    seenCount: 0,
    slides: [
      { type: 'text', content: 'Working on the new project!', footer: 'TECH DIARIES', bgColor: '#00a884' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&h=800&q=80' },
      { type: 'text', content: 'Just deployed the WhatsApp clone UI 🔥', footer: 'MILESTONES', bgColor: '#e67e22' },
    ],
  },
  {
    id: 'u2',
    name: 'Hira',
    image: 'https://ui-avatars.com/api/?name=Hira&background=9b59b6&color=fff',
    totalSlides: 3,
    seenCount: 0,
    slides: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=800&q=80' },
      { type: 'text', content: 'Coffee time! ☕', footer: 'CHILL', bgColor: '#9b59b6' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=400&h=800&q=80' },
    ],
  },
];
