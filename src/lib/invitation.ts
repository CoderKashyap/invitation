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

export type CeremonyTheme = "haldi" | "mehendi" | "sangeet" | "wedding" | "reception";

export type Ceremony = {
  id: string;
  kicker: string;
  title: string;
  poem: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  theme: CeremonyTheme;
  showContent: boolean;
};

export type Ritual = {
  name: string;
  time: string;
  note: string;
};

export type ScratchCard = {
  id: string;
  label: string;
  revealTitle: string;
  revealDetail: string;
};

export type Invitation = {
  slug: string;
  greeting: string;
  familiesLine: string;
  verse: string;
  blessing: string;
  gateCaption: string;
  gateHint: string;
  introVideo: string;
  welcomeImage: string;
  scratchKicker: string;
  scratchTitle: string;
  scratchHint: string;
  scratchUseTheme: boolean;
  scratchBackground: string;
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
  showGallery: boolean;
  galleryBackground: string;
  showCoupleIntro: boolean;
  coupleIntroImage: string;
  coupleImages: CoupleImage[];
  showClosing: boolean;
  closingTitle: string;
  closingNames: string;
  closingDate: string;
  closingVenue: string;
  closingBlessing: string;
  closingTagline: string;
  ceremonies: Ceremony[];
  rituals: Ritual[];
  scratchCards: ScratchCard[];
  map: {
    query: string;
    label: string;
    address: string;
  };
  showBranding: boolean;
  brandingText: string;
  contactNumber: string;
  backgroundAudio: string;
};

export const invitation: Invitation = {
  slug: "aarav-diya",
  greeting: "You are invited",
  familiesLine: "Together with their families",
  verse:
    "Two souls, one sacred promise, written in the stars, blessed by the divine, and sealed with love.",
  blessing: "May Ganeshji light the path, and may your blessings walk with us.",
  gateCaption: "A wedding invitation awaits",
  gateHint: "Tap to begin",
  introVideo: "",
  welcomeImage: "",
  scratchKicker: "The auspicious day",
  scratchTitle: "The wedding date",
  scratchHint: "Tap the seal",
  scratchUseTheme: false,
  scratchBackground: "",
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
  showGallery: true,
  galleryBackground: "",
  showCoupleIntro: true,
  coupleIntroImage: "",
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
      showContent: true,
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
      showContent: true,
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
      showContent: true,
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
      showContent: true,
    },
  ],
  scratchCards: [
    {
      id: "date",
      label: "The wedding date",
      revealTitle: "Saturday, 12 December 2026",
      revealDetail: "Save this auspicious day with us.",
    },
    {
      id: "time",
      label: "The hour",
      revealTitle: "5:00 in the evening",
      revealDetail: "The celebrations begin thereafter.",
    },
    {
      id: "venue",
      label: "The venue",
      revealTitle: "The Royal Palace",
      revealDetail: "Udaipur",
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
  showClosing: true,
  closingTitle: "We request the pleasure of your company",
  closingNames: "",
  closingDate: "",
  closingVenue: "",
  closingBlessing: "With love, light, and the blessings of our families",
  closingTagline: "A wedding invitation",
  showBranding: true,
  brandingText: "Crafted with Invitation Studio",
  contactNumber: "",
  backgroundAudio: "",
};

export function normalizeInvitation(content: Partial<Invitation> | Invitation): Invitation {
  return {
    ...invitation,
    ...content,
    introVideo: content.introVideo ?? invitation.introVideo,
    welcomeImage: content.welcomeImage ?? invitation.welcomeImage,
    showGallery: content.showGallery ?? invitation.showGallery,
    galleryBackground: content.galleryBackground ?? invitation.galleryBackground,
    showCoupleIntro: content.showCoupleIntro ?? invitation.showCoupleIntro,
    coupleIntroImage: content.coupleIntroImage ?? invitation.coupleIntroImage,
    showClosing: content.showClosing ?? invitation.showClosing,
    closingTitle: content.closingTitle ?? invitation.closingTitle,
    closingNames: content.closingNames ?? invitation.closingNames,
    closingDate: content.closingDate ?? invitation.closingDate,
    closingVenue: content.closingVenue ?? invitation.closingVenue,
    closingBlessing: content.closingBlessing ?? invitation.closingBlessing,
    closingTagline: content.closingTagline ?? invitation.closingTagline,
    scratchUseTheme: content.scratchUseTheme ?? invitation.scratchUseTheme,
    scratchBackground: content.scratchBackground ?? invitation.scratchBackground,
    showBranding: content.showBranding ?? invitation.showBranding,
    brandingText: content.brandingText ?? invitation.brandingText,
    contactNumber: content.contactNumber ?? invitation.contactNumber,
    backgroundAudio: content.backgroundAudio ?? invitation.backgroundAudio,
    groom: { ...invitation.groom, ...content.groom },
    bride: { ...invitation.bride, ...content.bride },
    wedding: { ...invitation.wedding, ...content.wedding },
    coupleImages: Array.isArray(content.coupleImages)
      ? content.coupleImages
      : invitation.coupleImages,
    ceremonies: (Array.isArray(content.ceremonies) ? content.ceremonies : invitation.ceremonies).map(
      (ceremony) => ({
        ...ceremony,
        showContent: ceremony.showContent !== false,
      }),
    ),
    rituals: Array.isArray(content.rituals) ? content.rituals : invitation.rituals,
    scratchCards: Array.isArray(content.scratchCards)
      ? content.scratchCards
      : invitation.scratchCards,
    map: { ...invitation.map, ...content.map },
  };
}
