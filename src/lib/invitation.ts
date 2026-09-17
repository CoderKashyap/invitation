export type CouplePerson = {
  firstName: string;
  fullName: string;
  parents: string;
};

export type CoupleImage = {
  src: string;
  alt: string;
  caption: string;
};

export type Ceremony = {
  id: "haldi" | "mehendi" | "sangeet" | "wedding";
  kicker: string;
  title: string;
  poem: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  theme: "haldi" | "mehendi" | "sangeet" | "wedding";
};

export type Ritual = {
  name: string;
  time: string;
  note: string;
};

export type Invitation = {
  slug: string;
  greeting: string;
  familiesLine: string;
  verse: string;
  blessing: string;
  groom: CouplePerson;
  bride: CouplePerson;
  initials: string;
  wedding: {
    iso: string;
    weekday: string;
    day: string;
    month: string;
    year: string;
    displayDate: string;
    displayTime: string;
    venue: string;
    city: string;
  };
  heroImage: string;
  doorImage: string;
  coupleImages: CoupleImage[];
  ceremonies: Ceremony[];
  rituals: Ritual[];
  map: {
    query: string;
    label: string;
    address: string;
  };
};

export const invitation: Invitation = {
  slug: "aarav-diya",
  greeting: "You are invited",
  familiesLine: "Together with their families",
  verse:
    "Two souls, one sacred promise, written in the stars, blessed by the divine, and sealed with love.",
  blessing: "May Ganeshji light the path, and may your blessings walk with us.",
  groom: {
    firstName: "Aarav",
    fullName: "Aarav Kapoor",
    parents: "Son of Smt. Meera & Shri Vikram Kapoor",
  },
  bride: {
    firstName: "Diya",
    fullName: "Diya Sharma",
    parents: "Daughter of Smt. Anjali & Shri Rajesh Sharma",
  },
  initials: "A & D",
  wedding: {
    iso: "2026-12-12T17:00:00+05:30",
    weekday: "Saturday",
    day: "12",
    month: "December",
    year: "2026",
    displayDate: "Saturday, 12 December 2026",
    displayTime: "5:00 in the evening onwards",
    venue: "The Royal Palace",
    city: "Udaipur",
  },
  heroImage: "/images/hero-fullscreen.png",
  doorImage: "/images/palace-doors.png",
  coupleImages: [
    {
      src: "/images/couple-hero.png",
      alt: "Aarav and Diya in traditional wedding attire",
      caption: "A promise in gold",
    },
    {
      src: "/images/couple-closeup.png",
      alt: "Close portrait of the couple",
      caption: "Written in our eyes",
    },
    {
      src: "/images/couple-candid.png",
      alt: "Candid moment of the couple laughing",
      caption: "The joy between",
    },
    {
      src: "/images/couple-walk.png",
      alt: "The couple walking through palace gardens",
      caption: "Towards forever",
    },
  ],
  ceremonies: [
    {
      id: "haldi",
      kicker: "The glow of beginnings",
      title: "Haldi Ceremony",
      poem: "May turmeric wash away the old, and paint this love in living gold.",
      date: "Thursday, 10 December 2026",
      time: "10:00 in the morning",
      venue: "The Garden Pavilion",
      image: "/images/haldi-ceremony.png",
      theme: "haldi",
    },
    {
      id: "mehendi",
      kicker: "Stories on the skin",
      title: "Mehendi Ceremony",
      poem: "In every leaf of henna, a blessing. In every swirl, a story of us.",
      date: "Thursday, 10 December 2026",
      time: "4:00 in the evening",
      venue: "The Courtyard Lawns",
      image: "/images/mehendi-ceremony.png",
      theme: "mehendi",
    },
    {
      id: "sangeet",
      kicker: "A night of song",
      title: "Sangeet Celebration",
      poem: "When the dhol calls, let your heart dance, tonight we celebrate in colour and song.",
      date: "Friday, 11 December 2026",
      time: "7:00 in the evening",
      venue: "The Royal Ballroom",
      image: "/images/sangeet-celebration.png",
      theme: "sangeet",
    },
    {
      id: "wedding",
      kicker: "The sacred union",
      title: "Wedding Ceremony",
      poem: "Under the mandap, two souls become one, blessed by fire, family, and the divine.",
      date: "Saturday, 12 December 2026",
      time: "5:00 in the evening onwards",
      venue: "The Royal Palace, Udaipur",
      image: "/images/wedding-ceremony.png",
      theme: "wedding",
    },
  ],
  rituals: [
    {
      name: "Baarat",
      time: "5:00 PM",
      note: "The groom’s procession arrives in joy, music, and light.",
    },
    {
      name: "Varmala",
      time: "6:30 PM",
      note: "Garlands exchanged, a first vow, offered in flowers.",
    },
    {
      name: "Ganesh Puja & Rituals",
      time: "7:00 PM",
      note: "Blessings invoked before the sacred fire.",
    },
    {
      name: "Pheras",
      time: "7:45 PM",
      note: "Seven circles, seven promises, one forever.",
    },
    {
      name: "Dinner & Celebrations",
      time: "9:00 PM",
      note: "Feast, laughter, and blessings under the palace lamps.",
    },
  ],
  map: {
    query: "City Palace, Udaipur, Rajasthan, India",
    label: "The Royal Palace",
    address: "City Palace Complex, Udaipur, Rajasthan 313001",
  },
};
