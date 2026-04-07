export const COMMUNITIES_DATA = [
    {
        id: '1',
        name: 'UMT ACM Student Chapter',
        // Reliable avatar service - automatic initials
        image: 'https://ui-avatars.com/api/?name=UMT+ACM&background=00a884&color=fff&size=128',
        subGroups: [
            {
                id: 'sg1',
                name: 'ACM Members',
                isJoined: true,
                lastMsg: '+92 302 1402652: is in...',
                time: '1:22 am'
            },
            {
                id: 'sg1-ann',
                name: 'UMT ACM Student Chapter',
                lastMsg: 'Announcement group',
                time: '',
                type: 'announcement',
                isPinned: true,
            },
            {
                id: 'sg1-career',
                name: 'Career Forum x ACM',
                lastMsg: '577 members',
                memberCount: 577,
                isJoined: false,
            },
            {
                id: 'sg1-leet',
                name: 'LeetCode',
                lastMsg: 'Request to join',
                isJoined: false,
                requestToJoin: true,
            }
        ],
        memberCount: 225,
        members: [
            { contactId: 'c1', role: 'Community Owner' },
            { contactId: 'c2', role: 'Community Admin' },
            { contactId: 'c3', role: 'Community Admin' },
            { contactId: 'c5' },
            { contactId: 'c7' },
            { contactId: 'c8' },
            { contactId: 'c9' },
            { contactId: 'c12' },
        ],
    },
    {
        id: '2',
        name: 'España 🇪🇸 "Product\'s" 99',
        image: 'https://ui-avatars.com/api/?name=Espana&background=e67e22&color=fff&size=128',
        subGroups: [
            {
                id: 'sg2',
                name: 'Announcements',
                lastMsg: 'Admin - 2: 📸 3363...',
                time: 'Yesterday',
                type: 'announcement',
            },
            {
                id: 'sg2-group',
                name: 'France customer',
                lastMsg: '+33 6 20 67 57 08 requested to join.',
                time: '23/12/2025',
                isJoined: true,
            }
        ],
        memberCount: 132,
        members: [
            { contactId: 'c2', role: 'Community Owner' },
            { contactId: 'c4', role: 'Community Admin' },
            { contactId: 'c6' },
            { contactId: 'c10' },
            { contactId: 'c11' },
            { contactId: 'c12' },
        ],
    }
];