import MESSAGE_STATUS from '@shared/constants/messageStatus';
// src/data/messages.js — rich dummy messages for each chat

// Helper to build a message object
const msg = (id, from, text, time, opts = {}) => ({
  id,
  from,          // 'me' | contactId
  type: opts.type || 'text',
  text,
  time,
  status: opts.status || (from === 'me' ? MESSAGE_STATUS.READ : null),
  replyTo: opts.replyTo || null,
  reactions: opts.reactions || {},
  media: opts.media || null,
  isDeleted: opts.isDeleted || false,
  isStarred: opts.isStarred || false,
  isForwarded: opts.isForwarded || false,
  location: opts.location || null,
  contact: opts.contact || null,
  document: opts.document || null,
  audio: opts.audio || null,
  duration: opts.duration || null,
});

export const messagesByChat = {
  // Chat with Sarah Johnson (c1)
  chat1: [
    msg('m1', 'c1', 'Hey! Did you get the report I sent?', '09:02', { status: null }),
    msg('m2', 'me', 'Yes! Just reviewed it. Looks great 👍', '09:05', { status: MESSAGE_STATUS.READ }),
    msg('m3', 'c1', 'Any changes needed?', '09:06'),
    msg('m4', 'me', 'Just minor formatting. I\'ll fix it and send back.', '09:08', { status: MESSAGE_STATUS.READ }),
    msg('m5', 'c1', 'Perfect, no rush! ☺️', '09:09'),
    msg('m6', 'me', 'Sent! Check your email 📧', '09:45', { status: MESSAGE_STATUS.READ }),
    msg('m7', 'c1', 'Got it, thanks! You\'re a lifesaver', '09:47'),
    msg('m8', 'c1', '❤️', '09:47', { reactions: { '❤️': ['me'] } }),
  ],

  // Chat with Ahmed Ali (c2)
  chat2: [
    msg('m20', 'c2', 'Salaam! Kya haal hai?', '08:00'),
    msg('m21', 'me', 'Alhamdulillah! Aap ka?', '08:02', { status: MESSAGE_STATUS.READ }),
    msg('m22', 'c2', 'Theek hai yaar. Aaj meeting hai 3 baje?', '08:03'),
    msg('m23', 'me', 'Haan bilkul, confirm hai', '08:05', { status: MESSAGE_STATUS.DELIVERED }),
    msg('m24', 'c2', 'Zoom link bhej dena', '08:06'),
    msg('m25', 'me', 'Abhi bhejta hoon', '08:07', { status: MESSAGE_STATUS.SENT }),
  ],

  // Group: Tech Team (group1)
  chat3: [
    msg('m40', 'c2', 'Good morning team!', '09:00'),
    msg('m41', 'c7', 'Morning! Ready for sprint review?', '09:01'),
    msg('m42', 'me', 'Let\'s crush it today 💪', '09:03', { status: MESSAGE_STATUS.READ }),
    msg('m43', 'c4', 'Slides are ready', '09:05'),
    msg('m44', 'c2', 'Sharing screen in 5 mins', '09:10'),
    msg('m45', 'me', '👍', '09:10', { status: MESSAGE_STATUS.READ }),
    msg('m46', 'c7', 'The new feature is deployed to staging btw', '09:15'),
    msg('m47', 'me', 'Nice! I\'ll QA it after standup', '09:16', { status: MESSAGE_STATUS.READ }),
    msg('m48', 'c4', 'Found a bug in the payment flow 🐛', '09:20'),
    msg('m49', 'c2', 'Priority 1 — someone own this?', '09:21'),
    msg('m50', 'me', 'I\'ll take it', '09:22', { status: MESSAGE_STATUS.READ }),
  ],

  // Chat with Emma Wilson (c3)
  chat4: [
    msg('m60', 'me', 'Hey Em, coffee today?', '10:00', { status: MESSAGE_STATUS.READ }),
    msg('m61', 'c3', 'Sure! 2pm at the usual place?', '10:15'),
    msg('m62', 'me', 'Perfect 🙌', '10:16', { status: MESSAGE_STATUS.READ }),
    msg('m63', 'c3', 'Btw did you finish that book?', '10:17'),
    msg('m64', 'me', 'Still on chapter 12 😅', '10:18', { status: MESSAGE_STATUS.READ }),
    msg('m65', 'c3', 'We need to talk about it — NO SPOILERS from me though!', '10:19'),
  ],

  // Chat with Maria Garcia (c5) — voice note + media example
  chat5: [
    msg('m80', 'c5', 'Check this out! 😍', '14:00'),
    msg('m81', 'c5', null, '14:01', {
      type: 'image',
      media: { width: 300, height: 200, caption: 'Sunset from my balcony 🌅' }
    }),
    msg('m82', 'me', 'Wow that\'s beautiful! Where is this?', '14:05', { status: MESSAGE_STATUS.READ }),
    msg('m83', 'c5', 'Barcelona! Come visit 🇪🇸', '14:06'),
    msg('m84', 'me', null, '14:08', {
      type: 'audio',
      audio: { duration: 12 },
      status: MESSAGE_STATUS.READ,
    }),
    msg('m85', 'c5', 'Haha yes you should!! 😂', '14:09'),
  ],

  // Family Group (group2)
  chat6: [
    msg('m100', 'c6', 'Dinner at mom\'s this Sunday!', '18:00'),
    msg('m101', 'c3', 'I\'ll be there 🙋‍♀️', '18:05'),
    msg('m102', 'me', 'What should I bring?', '18:07', { status: MESSAGE_STATUS.READ }),
    msg('m103', 'c6', 'Just yourself! Mom said she\'s making biryani 🍛', '18:08'),
    msg('m104', 'me', 'Say less 🏃‍♂️', '18:10', { status: MESSAGE_STATUS.READ }),
    msg('m105', 'c1', 'Love mom\'s biryani ❤️', '18:12'),
    msg('m106', 'c6', 'Confirmed — 7pm sharp people', '18:15'),
  ],

  // Archived Chat (c8)
  chat7: [
    msg('m120', 'c8', 'As-salamu alaykum', '2024-12-01T10:00:00Z'),
    msg('m121', 'me', 'Wa alaykum assalam! Long time!', '2024-12-01T10:05:00Z', { status: MESSAGE_STATUS.READ }),
    msg('m122', 'c8', 'How\'s everything going?', '2024-12-01T10:06:00Z'),
    msg('m123', 'me', 'Alhamdulillah, all good. And you?', '2024-12-01T10:08:00Z', { status: MESSAGE_STATUS.READ }),
    msg('m124', 'c8', 'Same here. Inshallah will catch up soon.', '2024-12-01T10:10:00Z'),
  ],

  // Pinned work chat (c2 direct but project context)
  chat8: [
    msg('m140', 'c2', 'The Q4 targets are updated in the sheet', '08:30'),
    msg('m141', 'me', 'Reviewing now', '08:35', { status: MESSAGE_STATUS.READ }),
    msg('m142', 'c2', null, '08:36', {
      type: 'document',
      document: { name: 'Q4_Targets_2025.xlsx', size: '124 KB', pages: null }
    }),
    msg('m143', 'me', 'Got it. Numbers look ambitious but doable', '08:45', { status: MESSAGE_STATUS.READ }),
    msg('m144', 'c2', 'That\'s the spirit 💪', '08:46'),
  ],

  // Muted chat (c9)
  chat9: [
    msg('m160', 'c9', 'Bro the new Elden Ring DLC is insane', '23:00'),
    msg('m161', 'me', 'Don\'t spoil it I haven\'t started yet 🙈', '23:05', { status: MESSAGE_STATUS.READ }),
    msg('m162', 'c9', 'OK OK no spoilers. But play it ASAP', '23:06'),
    msg('m163', 'c9', 'Also check this build I found 🔥', '23:07'),
    msg('m164', 'c9', 'Still there?', '23:30'),
    msg('m165', 'c9', 'Sleeping already? 😂', '23:45'),
  ],

  // Location message example (c5)
  chat10: [
    msg('m180', 'me', 'Where should we meet?', '15:00', { status: MESSAGE_STATUS.READ }),
    msg('m181', 'c5', null, '15:02', {
      type: 'location',
      location: { lat: 41.3851, lng: 2.1734, name: 'Sagrada Familia', address: 'Barcelona, Spain' }
    }),
    msg('m182', 'me', 'On my way! ETA 20 mins', '15:03', { status: MESSAGE_STATUS.READ }),
  ],
};

export const getMessagesForChat = (chatId) => messagesByChat[chatId] || [];

// Session 14, Upgrade 3: canonical migration — converts legacy
// { id, from, type, text, time, status, media, location, audio, document }
// into the new render schema { id, type, align, props }.
// Already-new-schema messages (with `.props`) pass through unchanged.
export const normalizeMessage = (rawMsg) => {
    if (rawMsg.props !== undefined) return rawMsg; // already new format
    const isMine = rawMsg.from === 'me';
    const align  = isMine ? 'right' : rawMsg.type === 'call' ? 'center' : 'left';
    let type = rawMsg.type || 'text';
    let props = {
        text:    rawMsg.text,
        time:    rawMsg.time,
        isMine,
        status:  rawMsg.status,
        sender:  rawMsg.from,
    };
    if (type === 'image' && rawMsg.media) {
        props = { ...props, src: '', caption: rawMsg.media.caption || '', reaction: undefined };
    } else if (type === 'audio') {
        props = { ...props, fileName: rawMsg.audio?.name || 'Audio', fileSize: rawMsg.audio?.duration ? `${rawMsg.audio.duration}s` : '' };
    } else if (type === 'location' && rawMsg.location) {
        props = { ...props, address: rawMsg.location.address || rawMsg.location.name || 'Location' };
    } else if (type === 'document' && rawMsg.document) {
        type = 'audio'; // render as file bubble (no DocumentBubble yet)
        props = { ...props, fileName: rawMsg.document.name || 'Document', fileSize: rawMsg.document.size || '' };
    }
    return { id: rawMsg.id, type, align, props };
};


export default messagesByChat;

export const INITIAL_MESSAGES = [
    { id: 'call1', type: 'call', align: 'center', props: { type: 'Voice call', time: '1:48 pm', isMissed: true } },
    { id: 'txt0', type: 'text', align: 'left', props: { text: 'Online class link...', time: '9:00 am', isMine: false } },
    { id: 'rep1', type: 'reply', align: 'left', props: { sender: 'Mustafa Hassan', replyTo: { id: 'txt0', name: 'Arman Adil', text: 'Online class link...' }, message: 'Idr kesa mila ga apko apni mail dekho bhai', time: '9:02 am', color: '#34b7f1' } },
    { id: 'img1', type: 'image', align: 'left', props: { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600', caption: 'ye to LMS k halat hain 💀😂', time: '8:58 am', reaction: '😂' } },
    { id: 'poll1', type: 'poll', align: 'left', props: { question: 'How are you celebrating?', options: [{ text: 'Showing up', votes: '138K', percentage: '65%' }, { text: 'Hyping them up', votes: '93.7K', percentage: '35%' }], time: '7:56 pm' } },
    { id: 'voice1', type: 'voice', align: 'right', props: { duration: '0:07', time: '1:26 am', isMine: true, status: 'read', reaction: '❤️' } },
    { id: 'aud1', type: 'audio', align: 'left', props: { fileName: 'AUD-20260310-WA0003.mp3', fileSize: '16 KB', time: '2:48 pm' } },
    { id: 'loc1', type: 'location', align: 'left', props: { address: 'Salman Block, Lahore', time: '2:47 pm' } },
    { id: 'con1', type: 'contact', align: 'left', props: { name: 'Owner ( España Products )', time: '2:55 pm' } },
    { id: 'evt1', type: 'event', align: 'right', props: { name: 'Meeting', time: '3:00 pm', date: '10', month: 'MAR', isMine: true } },
    { id: 'txt1', type: 'text', align: 'right', props: { text: 'کیا حال ہے؟ پروجیکٹ مکمل ہو گیا؟', time: '3:05 pm', isMine: true, isUrdu: true, status: 'read', reaction: '👍' } },
];

