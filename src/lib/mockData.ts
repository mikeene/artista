import type { User, Post, Comment, Notification, Chat, Message } from '@/types';

// ── Mock Users ───────────────────────────────────────
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    email: 'emeka@artista.ng',
    displayName: 'Emeka Okafor',
    username: 'emeka.creates',
    bio: 'Oil painter from Lagos. I paint the stories our streets whisper at dawn.',
    location: 'Lagos, Nigeria',
    role: 'artist',
    verified: true,
    followersCount: 1248,
    followingCount: 312,
    worksCount: 24,
    createdAt: new Date('2024-01-15'),
    artInterests: ['Painting', 'Mixed Media'],
    website: 'https://emeka.art',
    instagram: '@emeka.creates',
  },
  {
    id: 'u2',
    email: 'ngozi@artista.ng',
    displayName: 'Ngozi Dike',
    username: 'ngozidike',
    bio: 'Documentary photographer. Finding beauty in everyday Nigeria.',
    location: 'Abuja, Nigeria',
    role: 'artist',
    verified: true,
    followersCount: 3421,
    followingCount: 198,
    worksCount: 87,
    createdAt: new Date('2024-01-20'),
    artInterests: ['Photography', 'Digital Art'],
  },
  {
    id: 'u3',
    email: 'tunde@artista.ng',
    displayName: 'Tunde Alabi',
    username: 'tundeart',
    bio: 'Digital artist exploring Afrofuturism. Where tradition meets tomorrow.',
    location: 'Ibadan, Nigeria',
    role: 'artist',
    verified: false,
    followersCount: 892,
    followingCount: 445,
    worksCount: 41,
    createdAt: new Date('2024-02-01'),
    artInterests: ['Digital Art', 'Illustration'],
  },
  {
    id: 'u4',
    email: 'amara@artista.ng',
    displayName: 'Amara Eze',
    username: 'amaraeze',
    bio: 'Sculptor working with clay, bronze, and found objects from the Niger Delta.',
    location: 'Port Harcourt, Nigeria',
    role: 'artist',
    verified: false,
    followersCount: 567,
    followingCount: 230,
    worksCount: 9,
    createdAt: new Date('2024-02-10'),
    artInterests: ['Sculpture', 'Ceramics'],
  },
  {
    id: 'u5',
    email: 'fatima@artista.ng',
    displayName: 'Fatima Bello',
    username: 'fatimab',
    bio: 'Mixed media artist. Textile, color, and the geometry of kente.',
    location: 'Kano, Nigeria',
    role: 'artist',
    verified: true,
    followersCount: 2103,
    followingCount: 389,
    worksCount: 33,
    createdAt: new Date('2024-01-28'),
    artInterests: ['Textile', 'Mixed Media'],
  },
  {
    id: 'u6',
    email: 'kelechi@artista.ng',
    displayName: 'Kelechi Nwosu',
    username: 'kelechiart',
    bio: 'Printmaker and illustrator. Adire patterns reimagined for the digital age.',
    location: 'Enugu, Nigeria',
    role: 'artist',
    verified: false,
    followersCount: 1876,
    followingCount: 521,
    worksCount: 56,
    createdAt: new Date('2024-02-15'),
    artInterests: ['Printmaking', 'Illustration'],
  },
  // Current user (logged in)
  {
    id: 'current',
    email: 'you@artista.ng',
    displayName: 'Aisha Musa',
    username: 'aishamusa',
    bio: 'Art enthusiast & collector. Lagos × London.',
    location: 'Lagos, Nigeria',
    role: 'enthusiast',
    verified: false,
    followersCount: 124,
    followingCount: 89,
    worksCount: 0,
    createdAt: new Date('2024-03-01'),
    artInterests: ['Photography', 'Painting', 'Digital Art'],
  },
];

export const CURRENT_USER = MOCK_USERS[6];

// ── Mock Posts ───────────────────────────────────────
const GRADIENTS = [
  'art-terracotta', 'art-ocean', 'art-violet', 'art-earth',
  'art-sage', 'art-rose', 'art-indigo', 'art-amber',
];

function grad(i: number) { return GRADIENTS[i % GRADIENTS.length]; }

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1', authorId: 'u1', author: MOCK_USERS[0],
    title: 'Sunset at Eko Bridge',
    description: 'Oil on canvas, inspired by the golden hour over Lagos Lagoon. This piece took 3 weeks to complete — the light kept changing and I kept chasing it.',
    imageUrl: grad(0), thumbnailUrl: grad(0),
    medium: 'Painting', tags: ['Lagos', 'oil', 'landscape', 'Nigeria'],
    dimensions: '90cm × 120cm', likesCount: 284, commentsCount: 47, savesCount: 93, sharesCount: 12,
    isLiked: false, isSaved: false, createdAt: new Date('2024-11-01'), updatedAt: new Date('2024-11-01'), forSale: false,
  },
  {
    id: 'p2', authorId: 'u2', author: MOCK_USERS[1],
    title: 'Serenity (No. 3)',
    description: 'Part of an ongoing series documenting quiet moments in public spaces across Abuja.',
    imageUrl: grad(1), thumbnailUrl: grad(1),
    medium: 'Photography', tags: ['portrait', 'documentary', 'Abuja'],
    likesCount: 112, commentsCount: 29, savesCount: 54, sharesCount: 8,
    isLiked: true, isSaved: false, createdAt: new Date('2024-11-05'), updatedAt: new Date('2024-11-05'), forSale: false,
  },
  {
    id: 'p3', authorId: 'u3', author: MOCK_USERS[2],
    title: 'Digital Roots',
    description: 'What if ancient Yoruba symbols had a digital native era? This piece explores that question through generative forms.',
    imageUrl: grad(2), thumbnailUrl: grad(2),
    medium: 'Digital Art', tags: ['afrofuturism', 'Yoruba', 'digital', 'generative'],
    likesCount: 203, commentsCount: 61, savesCount: 127, sharesCount: 31,
    isLiked: false, isSaved: true, createdAt: new Date('2024-11-08'), updatedAt: new Date('2024-11-08'), forSale: false,
  },
  {
    id: 'p4', authorId: 'u4', author: MOCK_USERS[3],
    title: 'Clay Whispers',
    description: 'Hand-built ceramic vessel fired with local earth from the Niger Delta. Each crack is a story.',
    imageUrl: grad(3), thumbnailUrl: grad(3),
    medium: 'Ceramics', tags: ['ceramic', 'sculpture', 'NigerDelta', 'handmade'],
    dimensions: '30cm × 18cm', likesCount: 88, commentsCount: 14, savesCount: 41, sharesCount: 5,
    isLiked: false, isSaved: false, createdAt: new Date('2024-11-10'), updatedAt: new Date('2024-11-10'), forSale: false,
  },
  {
    id: 'p5', authorId: 'u5', author: MOCK_USERS[4],
    title: 'Lagos Garden Study',
    description: 'Mixed media — ink, fabric strips, and acrylic. Lagos is a garden if you look closely enough.',
    imageUrl: grad(4), thumbnailUrl: grad(4),
    medium: 'Mixed Media', tags: ['Lagos', 'textile', 'mixed', 'garden'],
    likesCount: 176, commentsCount: 32, savesCount: 68, sharesCount: 15,
    isLiked: true, isSaved: true, createdAt: new Date('2024-11-12'), updatedAt: new Date('2024-11-12'), forSale: false,
  },
  {
    id: 'p6', authorId: 'u6', author: MOCK_USERS[5],
    title: 'Adire Reimagined',
    description: 'Screen print on cotton. Traditional Adire resist-dyeing patterns reinterpreted for the 21st century.',
    imageUrl: grad(5), thumbnailUrl: grad(5),
    medium: 'Printmaking', tags: ['adire', 'print', 'textile', 'Yoruba', 'pattern'],
    likesCount: 341, commentsCount: 78, savesCount: 189, sharesCount: 44,
    isLiked: false, isSaved: false, createdAt: new Date('2024-11-14'), updatedAt: new Date('2024-11-14'), forSale: false,
  },
  {
    id: 'p7', authorId: 'u1', author: MOCK_USERS[0],
    title: 'Market Women, Balogun',
    description: 'Acrylic on board — the vibrant chaos and dignity of Balogun Market traders.',
    imageUrl: grad(6), thumbnailUrl: grad(6),
    medium: 'Painting', tags: ['Lagos', 'acrylic', 'portrait', 'market', 'women'],
    dimensions: '60cm × 80cm', likesCount: 193, commentsCount: 38, savesCount: 77, sharesCount: 19,
    isLiked: false, isSaved: false, createdAt: new Date('2024-11-16'), updatedAt: new Date('2024-11-16'), forSale: false,
  },
  {
    id: 'p8', authorId: 'u2', author: MOCK_USERS[1],
    title: 'The Quiet Hour',
    description: 'Dawn at a Lagos bus stop. The city belongs to a different kind of person at 5am.',
    imageUrl: grad(7), thumbnailUrl: grad(7),
    medium: 'Photography', tags: ['Lagos', 'dawn', 'street', 'documentary'],
    likesCount: 267, commentsCount: 51, savesCount: 108, sharesCount: 23,
    isLiked: false, isSaved: false, createdAt: new Date('2024-11-18'), updatedAt: new Date('2024-11-18'), forSale: false,
  },
  {
    id: 'p9', authorId: 'u3', author: MOCK_USERS[2],
    title: 'Ògún Rising',
    description: 'A tribute to the Yoruba deity of iron and war through digital light painting.',
    imageUrl: grad(0), thumbnailUrl: grad(0),
    medium: 'Digital Art', tags: ['Yoruba', 'deity', 'digital', 'afrofuturism', 'light'],
    likesCount: 412, commentsCount: 94, savesCount: 231, sharesCount: 67,
    isLiked: true, isSaved: false, createdAt: new Date('2024-11-20'), updatedAt: new Date('2024-11-20'), forSale: false,
  },
  {
    id: 'p10', authorId: 'u5', author: MOCK_USERS[4],
    title: 'Kente Study No. 7',
    description: 'Exploring the geometry of West African kente weaving through mixed media on paper.',
    imageUrl: grad(3), thumbnailUrl: grad(3),
    medium: 'Mixed Media', tags: ['kente', 'geometry', 'textile', 'WestAfrica'],
    likesCount: 154, commentsCount: 27, savesCount: 63, sharesCount: 11,
    isLiked: false, isSaved: false, createdAt: new Date('2024-11-22'), updatedAt: new Date('2024-11-22'), forSale: false,
  },
  {
    id: 'p11', authorId: 'u6', author: MOCK_USERS[5],
    title: 'Eko Bridge at Night',
    description: 'Lithograph print. Lagos infrastructure as abstract landscape.',
    imageUrl: grad(2), thumbnailUrl: grad(2),
    medium: 'Printmaking', tags: ['Lagos', 'print', 'architecture', 'night'],
    likesCount: 221, commentsCount: 43, savesCount: 95, sharesCount: 28,
    isLiked: false, isSaved: false, createdAt: new Date('2024-11-24'), updatedAt: new Date('2024-11-24'), forSale: false,
  },
  {
    id: 'p12', authorId: 'u4', author: MOCK_USERS[3],
    title: 'Terra Forms',
    description: 'Bronze cast sculpture. The earth\'s memory made tangible.',
    imageUrl: grad(1), thumbnailUrl: grad(1),
    medium: 'Sculpture', tags: ['bronze', 'abstract', 'earth', 'NigerDelta'],
    dimensions: '45cm × 28cm × 15cm',
    likesCount: 98, commentsCount: 21, savesCount: 46, sharesCount: 7,
    isLiked: false, isSaved: false, createdAt: new Date('2024-11-26'), updatedAt: new Date('2024-11-26'), forSale: false,
  },
];

// ── Mock Comments ────────────────────────────────────
export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1', postId: 'p1', authorId: 'u2', author: MOCK_USERS[1],
    content: 'The way you captured that golden hour light is extraordinary. I can almost feel the heat rising off the water.',
    likesCount: 12, isLiked: false, createdAt: new Date('2024-11-01T15:30:00'),
  },
  {
    id: 'c2', postId: 'p1', authorId: 'u5', author: MOCK_USERS[4],
    content: 'This makes me so proud. Lagos through your eyes is magic ✨',
    likesCount: 8, isLiked: true, createdAt: new Date('2024-11-01T18:00:00'),
  },
  {
    id: 'c3', postId: 'p1', authorId: 'u3', author: MOCK_USERS[2],
    content: 'What oil paints did you use for those warm sunset tones? The colour mixing is so natural.',
    likesCount: 4, isLiked: false, createdAt: new Date('2024-11-02T09:15:00'),
  },
  {
    id: 'c4', postId: 'p3', authorId: 'u1', author: MOCK_USERS[0],
    content: 'This is exactly the kind of work that represents where African art is going. Incredible vision.',
    likesCount: 23, isLiked: false, createdAt: new Date('2024-11-08T14:00:00'),
  },
];

// ── Mock Notifications ───────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1', type: 'like', fromUser: MOCK_USERS[0], toUserId: 'current',
    postId: 'p3', post: { id: 'p3', title: 'Digital Roots', imageUrl: 'art-violet' },
    read: false, createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 'n2', type: 'follow', fromUser: MOCK_USERS[4], toUserId: 'current',
    read: false, createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 'n3', type: 'comment', fromUser: MOCK_USERS[1], toUserId: 'current',
    postId: 'p5', post: { id: 'p5', title: 'Lagos Garden Study', imageUrl: 'art-sage' },
    message: 'The texture in this piece is remarkable!',
    read: false, createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: 'n4', type: 'like', fromUser: MOCK_USERS[2], toUserId: 'current',
    postId: 'p1', post: { id: 'p1', title: 'Sunset at Eko Bridge', imageUrl: 'art-terracotta' },
    read: true, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'n5', type: 'follow', fromUser: MOCK_USERS[5], toUserId: 'current',
    read: true, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'n6', type: 'mention', fromUser: MOCK_USERS[3], toUserId: 'current',
    postId: 'p6', message: 'mentioned you in a comment',
    read: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

// ── Mock Chats ───────────────────────────────────────
export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1', chatId: 'chat1', senderId: 'u1', sender: MOCK_USERS[0],
    content: 'Hey! I loved your comment on my piece. Thank you so much 🙏', read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'm2', chatId: 'chat1', senderId: 'current', sender: CURRENT_USER,
    content: 'Of course! The way you captured the light is just stunning.', read: true,
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: 'm3', chatId: 'chat1', senderId: 'u1', sender: MOCK_USERS[0],
    content: 'I\'m working on a new series — might share some previews here first 😊', read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat1',
    participants: [CURRENT_USER, MOCK_USERS[0]],
    lastMessage: MOCK_MESSAGES[2],
    unreadCount: 1,
    updatedAt: MOCK_MESSAGES[2].createdAt,
  },
  {
    id: 'chat2',
    participants: [CURRENT_USER, MOCK_USERS[1]],
    lastMessage: {
      id: 'm4', chatId: 'chat2', senderId: 'u2', sender: MOCK_USERS[1],
      content: 'Would love to collaborate on a project sometime!', read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'chat3',
    participants: [CURRENT_USER, MOCK_USERS[4]],
    lastMessage: {
      id: 'm5', chatId: 'chat3', senderId: 'u5', sender: MOCK_USERS[4],
      content: 'Thank you for following! ✨', read: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// ── Categories ───────────────────────────────────────
export const ART_CATEGORIES = [
  'All', 'Painting', 'Photography', 'Digital Art', 'Sculpture',
  'Illustration', 'Mixed Media', 'Textile', 'Printmaking',
  'Ceramics', 'Street Art', 'Installation', 'Video Art',
];
