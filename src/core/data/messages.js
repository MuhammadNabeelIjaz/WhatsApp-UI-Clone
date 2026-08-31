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
  // Chat with yourself (me_contact)
  chat_me: [
    msg('me1', 'me', 'Notes for today', 'Now', { status: MESSAGE_STATUS.READ })
  ],

  // Chat with Ayesha (c1)
  chat1: [
    msg('m1', 'c1', 'Assalam o Alaikum! Assignment bhej di?', '09:02', { status: null }),
    msg('m2', 'me', 'Walaikum Assalam! Haan bas abhi email ki hai.', '09:05', { status: MESSAGE_STATUS.READ }),
    msg('m3', 'c1', 'Check karti hun, koi changes to nahi karne?', '09:06'),
    msg('m4', 'me', 'Thori formatting baki thi, main ne kar di hai.', '09:08', { status: MESSAGE_STATUS.READ }),
    msg('m5', 'c1', 'Zabardast, thank you so much! ☺️', '09:09'),
    msg('m6', 'me', 'No problem at all! 📧', '09:45', { status: MESSAGE_STATUS.READ }),
    msg('m7', 'c1', 'Got it, thanks! You\'re a lifesaver', '09:47'),
    msg('m8', 'c1', '❤️', '09:47', { reactions: { '❤️': ['me'] } }),
    msg('m9', 'c1', 'This is the most up-to-date file.', '09:47', { type: 'document', document: { name: 'Q4_Report.pdf', size: '2.4 MB', pages: 12, extension: 'pdf' } }),
  ],

  // Chat with Usman Jami (c2)
  chat2: [
    msg('m20', 'c2', 'Salaam! Kya haal hai?', '08:00'),
    msg('m21', 'me', 'Alhamdulillah! Aap sunaen?', '08:02', { status: MESSAGE_STATUS.READ }),
    msg('m22', 'c2', 'Theek thak yaar. Aaj meeting 3 baje hai na?', '08:03'),
    msg('m23', 'me', 'Haan bilkul, confirm hai', '08:05', { status: MESSAGE_STATUS.DELIVERED }),
    msg('m24', 'c2', 'Zoom link bhej dena time pe', '08:06'),
    msg('m25', 'me', 'Abhi bhejta hoon', '08:07', { status: MESSAGE_STATUS.SENT }),
  ],

  // Group: Tech Team (group1)
  chat3: [
    msg('m40', 'c2', 'Good morning team! Aaj ki update?', '09:00'),
    msg('m41', 'c7', 'Morning! Standup 10 baje rakhte hain', '09:01'),
    msg('m42', 'me', 'Done! Main API complete kar raha hun 💪', '09:03', { status: MESSAGE_STATUS.READ }),
    msg('m43', 'c4', 'Frontend is almost ready', '09:05'),
    msg('m44', 'c2', 'Screenshare karta hun 5 mins main', '09:10'),
    msg('m45', 'me', '👍', '09:10', { status: MESSAGE_STATUS.READ }),
    msg('m46', 'c7', 'Deployment staging pe ho gai hai btw', '09:15'),
    msg('m47', 'me', 'Nice! QA main check karta hun', '09:16', { status: MESSAGE_STATUS.READ }),
    msg('m48', 'c4', 'Payment gateway main ek issue aa raha hai 🐛', '09:20'),
    msg('m49', 'c2', 'Koi isko dekh le urgent', '09:21'),
    msg('m50', 'me', 'I\'ll take it', '09:22', { status: MESSAGE_STATUS.READ }),
  ],

  // Chat with Hira (c3)
  chat4: [
    msg('m60', 'me', 'Hey Hira, assignment submit karwani hai aaj?', '10:00', { status: MESSAGE_STATUS.READ }),
    msg('m61', 'c3', 'Haan yaar! Deadline 12 baje tak ki hai.', '10:15'),
    msg('m62', 'me', 'Shukar hai, main samjha 10 baje thi 🙌', '10:16', { status: MESSAGE_STATUS.READ }),
    msg('m63', 'c3', 'Btw Notes mil gaye thay tumhein?', '10:17'),
    msg('m64', 'me', 'Haan print nikalwa liye hain 😅', '10:18', { status: MESSAGE_STATUS.READ }),
    msg('m65', 'c3', 'We need to talk about it — NO SPOILERS from me though!', '10:19'),
  ],

  // Chat with Sana (c5) — voice note + media example
  chat5: [
    msg('m80', 'c5', 'Check this out! 😍', '14:00'),
    msg('m81', 'c5', null, '14:01', {
      type: 'image',
      media: { width: 300, height: 200, caption: 'Lahore ki barish 🌅' }
    }),
    msg('m82', 'me', 'Wow that\'s beautiful! Mausam kaisa hai wahan?', '14:05', { status: MESSAGE_STATUS.READ }),
    msg('m83', 'c5', 'Bohot zabardast! Tum log kab aogay? 🇵🇰', '14:06'),
    msg('m84', 'me', null, '14:08', {
      type: 'audio',
      audio: { duration: 12 },
      status: MESSAGE_STATUS.READ,
    }),
    msg('m85', 'c5', 'Haha yes you should!! 😂', '14:09'),
  ],

  // Family Group (group2)
  chat6: [
    msg('m100', 'c6', 'Sunday ko daawat hai meri taraf!', '18:00'),
    msg('m101', 'c3', 'Ahan! Main zarur aungi 🙋‍♀️', '18:05'),
    msg('m102', 'me', 'Koi sweets waghera leni hain to bata dena.', '18:07', { status: MESSAGE_STATUS.READ }),
    msg('m103', 'c6', 'Nahi bas time pe aa jana! Biryani banai hai 🍛', '18:08'),
    msg('m104', 'me', 'Say less 🏃‍♂️', '18:10', { status: MESSAGE_STATUS.READ }),
    msg('m105', 'c1', 'Tahir bhai ki biryani ❤️', '18:12'),
    msg('m106', 'c6', 'Confirmed — 7pm sharp people', '18:15'),
  ],

  // Community Announcement 1 (Global Tech Innovators)
  'sg1-ann': [
    msg('ann1', 'c1', 'Welcome everyone to the Global Tech Innovators community! We will post all major updates here.', 'Monday'),
    msg('ann2', 'c1', 'Next week we have a special guest speaker joining our Q&A session. Stay tuned!', '10:00'),
  ],

  // Community Announcement 2 (React Developers Network)
  'sg2': [
    msg('ann3', 'c2', 'Welcome to React Developers Network!', 'Yesterday'),
    msg('ann4', 'c2', 'Please make sure to read the community guidelines before posting in other groups.', '11:00'),
  ],

  // Archived Chat (c8)
  chat7: [
    msg('m120', 'c8', 'As-salamu alaykum', '2024-12-01T10:00:00Z'),
    msg('m121', 'me', 'Wa alaykum assalam! Long time!', '2024-12-01T10:05:00Z', { status: MESSAGE_STATUS.READ }),
    msg('m122', 'c8', 'Sab khairiyat hai?', '2024-12-01T10:06:00Z'),
    msg('m123', 'me', 'Alhamdulillah, all good. Ap sunao?', '2024-12-01T10:08:00Z', { status: MESSAGE_STATUS.READ }),
    msg('m124', 'c8', 'Same here. Inshallah will catch up soon.', '2024-12-01T10:10:00Z'),
  ],

  // Pinned work chat (c11 direct but project context)
  chat8: [
    msg('m140', 'c11', 'Q4 targets maine update kar diye hain sheet mein', '08:30'),
    msg('m141', 'me', 'Reviewing now', '08:35', { status: MESSAGE_STATUS.READ }),
    msg('m142', 'c11', null, '08:36', {
      type: 'document',
      document: { name: 'Q4_Targets_2025.xlsx', size: '124 KB', pages: null }
    }),
    msg('m143', 'me', 'Mil gaye. Thore ambitious hain but we can manage.', '08:45', { status: MESSAGE_STATUS.READ }),
    msg('m144', 'c11', 'That\'s the spirit 💪', '08:46'),
  ],

  // Muted chat (c9)
  chat9: [
    msg('m160', 'c9', 'Bro PUBG ki nayi update kheli hai?', '23:00'),
    msg('m161', 'me', 'Nahi yaar, time hi nahi mil raha 🙈', '23:05', { status: MESSAGE_STATUS.READ }),
    msg('m162', 'c9', 'Rat ko aao online, maza ayega', '23:06'),
    msg('m163', 'c9', 'Also check this gameplay I recorded 🔥', '23:07'),
    msg('m164', 'c9', 'Still there?', '23:30'),
    msg('m165', 'c9', 'Sleeping already? 😂', '23:45'),
  ],

  // Location message example (c5)
  chat10: [
    msg('m180', 'me', 'Kahan aana hai batao?', '15:00', { status: MESSAGE_STATUS.READ }),
    msg('m181', 'c5', null, '15:02', {
      type: 'location',
      location: { lat: 31.5204, lng: 74.3587, name: 'Packages Mall', address: 'Lahore, Pakistan' }
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
    { id: 'img1', type: 'image', align: 'left', props: { src: 'https://placehold.co/600x400/png', caption: 'ye to LMS k halat hain 💀😂', time: '8:58 am', reaction: '😂' } },
    { id: 'poll1', type: 'poll', align: 'left', props: { question: 'How are you celebrating?', options: [{ text: 'Showing up', votes: '138K', percentage: '65%' }, { text: 'Hyping them up', votes: '93.7K', percentage: '35%' }], time: '7:56 pm' } },
    { id: 'voice1', type: 'voice', align: 'right', props: { duration: '0:07', time: '1:26 am', isMine: true, status: 'read', reaction: '❤️' } },
    { id: 'aud1', type: 'audio', align: 'left', props: { fileName: 'AUD-20260310-WA0003.mp3', fileSize: '16 KB', time: '2:48 pm' } },
    { id: 'loc1', type: 'location', align: 'left', props: { address: 'Salman Block, Lahore', time: '2:47 pm' } },
    { id: 'con1', type: 'contact', align: 'left', props: { name: 'Owner ( España Products )', time: '2:55 pm' } },
    { id: 'evt1', type: 'event', align: 'right', props: { name: 'Meeting', time: '3:00 pm', date: '10', month: 'MAR', isMine: true } },
    { id: 'txt1', type: 'text', align: 'right', props: { text: 'کیا حال ہے؟ پروجیکٹ مکمل ہو گیا؟', time: '3:05 pm', isMine: true, isUrdu: true, status: 'read', reaction: '👍' } },
];

