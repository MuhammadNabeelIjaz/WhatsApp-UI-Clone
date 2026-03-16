// src/core/data/statuses.js
// Seed data for contacts' status updates, shown on the Status/Updates screen.
// `seenCount` tracks how many of `slides` the current user has viewed so far.

export const contactStatuses = [
  {
    id: 'u1',
    name: 'Nabeel Ijaz',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    totalSlides: 3,
    seenCount: 0,
    slides: [
      { type: 'text', content: 'Learning React is fun!', footer: 'TECH DIARIES' },
      { type: 'image', url: 'https://picsum.photos/seed/a1/800/1200' },
      { type: 'text', content: 'Almost done!', footer: 'CODING' },
    ],
  },
  {
    id: 'u2',
    name: 'Nishi',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    totalSlides: 2,
    seenCount: 0,
    slides: [
      { type: 'image', url: 'https://picsum.photos/seed/a2/800/1200' },
      { type: 'image', url: 'https://picsum.photos/seed/a3/800/1200' },
    ],
  },
];
