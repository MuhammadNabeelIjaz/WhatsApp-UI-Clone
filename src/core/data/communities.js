export const COMMUNITIES_DATA = [
    {
        id: '1',
        name: 'Global Tech Innovators',
        // Reliable avatar service - automatic initials
        image: 'https://ui-avatars.com/api/?name=Global+Tech&background=00a884&color=fff&size=128',
        subGroups: [
            {
                id: 'sg1',
                name: 'Core Team',
                isJoined: true,
                lastMsg: '+1 555-010-0013: is in...',
                time: '1:22 am'
            },
            {
                id: 'sg1-ann',
                name: 'Global Tech Innovators',
                lastMsg: 'Announcement group',
                time: '',
                type: 'announcement',
                isPinned: true,
            },
            {
                id: 'sg1-career',
                name: 'Career Forum',
                lastMsg: '577 members',
                memberCount: 577,
                isJoined: false,
            },
            {
                id: 'sg1-leet',
                name: 'Algorithms & DS',
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
        name: 'React Developers Network',
        image: 'https://ui-avatars.com/api/?name=React+Devs&background=e67e22&color=fff&size=128',
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
                name: 'Client Projects',
                lastMsg: '+1 555-010-0014 requested to join.',
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