export const MOCK_CATEGORIES = [
  { id: 1, name: 'Bagues', slug: 'bagues', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600' },
  { id: 2, name: 'Colliers', slug: 'colliers', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600' },
  { id: 3, name: 'Bracelets', slug: 'bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600' },
  { id: 4, name: 'Broches', slug: 'broches', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600' },
];

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Bague Aura Dorée',
    slug: 'bague-aura-doree',
    description: 'Une bague majestueuse ornée d\'un éclat doré incomparable. Sculptée avec précision dans de l\'argent massif plaqué or 18k, elle symbolise la lumière et le raffinement.',
    price: 4500,
    sale_price: 3800,
    stock: 12,
    category_id: 1,
    category: { id: 1, name: 'Bagues', slug: 'bagues' },
    is_featured: true,
    is_active: true,
    primary_image: { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600', alt: 'Bague Aura Dorée' },
    images: [
      { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600', alt: 'Bague Aura Dorée vue principale' },
      { url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600', alt: 'Bague Aura Dorée vue portée' }
    ],
    variants: [
      { id: 101, size: '52', color: 'Or Jaune', material: 'Plaqué Or 18k', stock: 5, price_modifier: 0 },
      { id: 102, size: '54', color: 'Or Jaune', material: 'Plaqué Or 18k', stock: 4, price_modifier: 0 },
      { id: 103, size: '56', color: 'Or Jaune', material: 'Plaqué Or 18k', stock: 3, price_modifier: 200 }
    ],
    reviews: [
      { id: 1, rating: 5, comment: 'Magnifique bague ! La couleur dorée est splendide et tient très bien.', user: { name: 'Amel B.' }, is_approved: true }
    ]
  },
  {
    id: 2,
    name: 'Collier Céleste Solitaire',
    slug: 'collier-celeste-solitaire',
    description: 'Ce collier délicat dispose d\'un diamant d\'imitation taillé en poire monté sur une chaîne en or fin. L\'élégance discrète à son paroxysme.',
    price: 8900,
    sale_price: null,
    stock: 5,
    category_id: 2,
    category: { id: 2, name: 'Colliers', slug: 'colliers' },
    is_featured: true,
    is_active: true,
    primary_image: { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600', alt: 'Collier Céleste Solitaire' },
    images: [
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600', alt: 'Collier Céleste Solitaire' }
    ],
    variants: [
      { id: 201, size: 'Unique', color: 'Or Jaune', material: 'Or Fin 9k', stock: 5, price_modifier: 0 }
    ],
    reviews: [
      { id: 2, rating: 4, comment: 'Très joli collier, discret et très élégant pour toutes les occasions.', user: { name: 'Kenza T.' }, is_approved: true }
    ]
  },
  {
    id: 3,
    name: 'Bracelet Jonc Royal',
    slug: 'bracelet-jonc-royal',
    description: 'Un jonc martelé à la main, rehaussé de motifs botaniques gravés inspirés de l\'art traditionnel Rym_accesoire. Un design intemporel.',
    price: 6200,
    sale_price: 5500,
    stock: 8,
    category_id: 3,
    category: { id: 3, name: 'Bracelets', slug: 'bracelets' },
    is_featured: true,
    is_active: true,
    primary_image: { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600', alt: 'Bracelet Jonc Royal' },
    images: [
      { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600', alt: 'Bracelet Jonc Royal' }
    ],
    variants: [
      { id: 301, size: 'M', color: 'Or Jaune', material: 'Laiton Doré', stock: 4, price_modifier: 0 },
      { id: 302, size: 'L', color: 'Or Jaune', material: 'Laiton Doré', stock: 4, price_modifier: 0 }
    ],
    reviews: [
      { id: 3, rating: 5, comment: 'Superbe bracelet jonc, emballage soigné et envoi rapide.', user: { name: 'Sarah M.' }, is_approved: true }
    ]
  },
  {
    id: 4,
    name: 'Bague Divine Émeraude',
    slug: 'bague-divine-emeraude',
    description: 'Une somptueuse bague mettant en valeur une émeraude synthétique taillée en émeraude entourée de fins cristaux de zircone. Un bijou digne des plus grands événements.',
    price: 12000,
    sale_price: null,
    stock: 3,
    category_id: 1,
    category: { id: 1, name: 'Bagues', slug: 'bagues' },
    is_featured: false,
    is_active: true,
    primary_image: { url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600', alt: 'Bague Divine Émeraude' },
    images: [
      { url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600', alt: 'Bague Divine Émeraude' }
    ],
    variants: [
      { id: 401, size: '54', color: 'Or Jaune', material: 'Plaqué Or 18k', stock: 2, price_modifier: 0 },
      { id: 402, size: '56', color: 'Or Jaune', material: 'Plaqué Or 18k', stock: 1, price_modifier: 0 }
    ],
    reviews: []
  },
  {
    id: 5,
    name: 'Collier Perla Baroque',
    slug: 'collier-perla-baroque',
    description: 'Une véritable perle d\'eau douce baroque suspendue à une délicate chaîne à billes dorée. Chaque perle est unique en forme et reflets.',
    price: 7800,
    sale_price: 6900,
    stock: 0, // Rupture de stock
    category_id: 2,
    category: { id: 2, name: 'Colliers', slug: 'colliers' },
    is_featured: false,
    is_active: true,
    primary_image: { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600', alt: 'Collier Perla Baroque' },
    images: [
      { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600', alt: 'Collier Perla Baroque' }
    ],
    variants: [
      { id: 501, size: 'Unique', color: 'Or Jaune', material: 'Perle d\'eau douce', stock: 0, price_modifier: 0 }
    ],
    reviews: [
      { id: 4, rating: 5, comment: 'Sublime perle baroque, j\'adore la forme unique.', user: { name: 'Yasmine S.' }, is_approved: true }
    ]
  },
  {
    id: 6,
    name: 'Broche Fleur de Lys Dorée',
    slug: 'broche-fleur-de-lys-doree',
    description: 'Une broche majestueuse représentant la Fleur de Lys, symbole de noblesse, sertie de micro-cristaux scintillants. Idéale pour rehausser une veste ou une écharpe.',
    price: 5900,
    sale_price: null,
    stock: 15,
    category_id: 4,
    category: { id: 4, name: 'Broches', slug: 'broches' },
    is_featured: false,
    is_active: true,
    primary_image: { url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600', alt: 'Broche Fleur de Lys Dorée' },
    images: [
      { url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600', alt: 'Broche Fleur de Lys' }
    ],
    variants: [
      { id: 601, size: 'Unique', color: 'Or Jaune', material: 'Zircone & Laiton', stock: 15, price_modifier: 0 }
    ],
    reviews: []
  }
];

export const MOCK_WILAYAS = [
  { wilaya_code: '01', wilaya_name: 'Adrar', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '02', wilaya_name: 'Chlef', home_cost: 500, relay_cost: 350, delay_days: '2-4 jours' },
  { wilaya_code: '03', wilaya_name: 'Laghouat', home_cost: 700, relay_cost: 450, delay_days: '3-5 jours' },
  { wilaya_code: '04', wilaya_name: 'Oum El Bouaghi', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '05', wilaya_name: 'Batna', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '06', wilaya_name: 'Béjaïa', home_cost: 550, relay_cost: 350, delay_days: '2-3 jours' },
  { wilaya_code: '07', wilaya_name: 'Biskra', home_cost: 700, relay_cost: 450, delay_days: '3-5 jours' },
  { wilaya_code: '08', wilaya_name: 'Béchar', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '09', wilaya_name: 'Blida', home_cost: 450, relay_cost: 300, delay_days: '1-3 jours' },
  { wilaya_code: '10', wilaya_name: 'Bouira', home_cost: 500, relay_cost: 350, delay_days: '2-3 jours' },
  { wilaya_code: '11', wilaya_name: 'Tamanrasset', home_cost: 1000, relay_cost: 700, delay_days: '5-10 jours' },
  { wilaya_code: '12', wilaya_name: 'Tébessa', home_cost: 700, relay_cost: 450, delay_days: '3-5 jours' },
  { wilaya_code: '13', wilaya_name: 'Tlemcen', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '14', wilaya_name: 'Tiaret', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '15', wilaya_name: 'Tizi Ouzou', home_cost: 500, relay_cost: 350, delay_days: '2-3 jours' },
  { wilaya_code: '16', wilaya_name: 'Alger', home_cost: 400, relay_cost: 250, delay_days: '1-2 jours' },
  { wilaya_code: '17', wilaya_name: 'Djelfa', home_cost: 700, relay_cost: 450, delay_days: '3-5 jours' },
  { wilaya_code: '18', wilaya_name: 'Jijel', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '19', wilaya_name: 'Sétif', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '20', wilaya_name: 'Saïda', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '21', wilaya_name: 'Skikda', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '22', wilaya_name: 'Sidi Bel Abbès', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '23', wilaya_name: 'Annaba', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '24', wilaya_name: 'Guelma', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '25', wilaya_name: 'Constantine', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '26', wilaya_name: 'Médéa', home_cost: 500, relay_cost: 350, delay_days: '2-3 jours' },
  { wilaya_code: '27', wilaya_name: 'Mostaganem', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '28', wilaya_name: 'M\'Sila', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '29', wilaya_name: 'Mascara', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '30', wilaya_name: 'Ouargla', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '31', wilaya_name: 'Oran', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '32', wilaya_name: 'El Bayadh', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '33', wilaya_name: 'Illizi', home_cost: 1000, relay_cost: 700, delay_days: '5-10 jours' },
  { wilaya_code: '34', wilaya_name: 'Bordj Bou Arreridj', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '35', wilaya_name: 'Boumerdès', home_cost: 450, relay_cost: 300, delay_days: '1-3 jours' },
  { wilaya_code: '36', wilaya_name: 'El Tarf', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '37', wilaya_name: 'Tindouf', home_cost: 1000, relay_cost: 700, delay_days: '5-10 jours' },
  { wilaya_code: '38', wilaya_name: 'Tissemsilt', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '39', wilaya_name: 'El Oued', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '40', wilaya_name: 'Khenchela', home_cost: 700, relay_cost: 450, delay_days: '3-5 jours' },
  { wilaya_code: '41', wilaya_name: 'Souk Ahras', home_cost: 700, relay_cost: 450, delay_days: '3-5 jours' },
  { wilaya_code: '42', wilaya_name: 'Tipaza', home_cost: 450, relay_cost: 300, delay_days: '1-3 jours' },
  { wilaya_code: '43', wilaya_name: 'Mila', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '44', wilaya_name: 'Aïn Defla', home_cost: 500, relay_cost: 350, delay_days: '2-3 jours' },
  { wilaya_code: '45', wilaya_name: 'Naâma', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '46', wilaya_name: 'Aïn Témouchent', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '47', wilaya_name: 'Ghardaïa', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '48', wilaya_name: 'Relizane', home_cost: 600, relay_cost: 400, delay_days: '2-4 jours' },
  { wilaya_code: '49', wilaya_name: 'Timimoun', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '50', wilaya_name: 'Bordj Badji Mokhtar', home_cost: 1000, relay_cost: 700, delay_days: '5-10 jours' },
  { wilaya_code: '51', wilaya_name: 'Ouled Djellal', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '52', wilaya_name: 'Béni Abbès', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '53', wilaya_name: 'In Salah', home_cost: 1000, relay_cost: 700, delay_days: '5-10 jours' },
  { wilaya_code: '54', wilaya_name: 'In Guezzam', home_cost: 1000, relay_cost: 700, delay_days: '5-10 jours' },
  { wilaya_code: '55', wilaya_name: 'Touggourt', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '56', wilaya_name: 'Djanet', home_cost: 1000, relay_cost: 700, delay_days: '5-10 jours' },
  { wilaya_code: '57', wilaya_name: 'El M\'Ghair', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
  { wilaya_code: '58', wilaya_name: 'El Meniaa', home_cost: 800, relay_cost: 500, delay_days: '4-7 jours' },
];
