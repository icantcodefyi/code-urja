export const graphData: Array<{
  id: number;
  currentHeight?: string;
  previousHeight?: string;
}> = [
  {
    id: 1,
    currentHeight: "50px",
    previousHeight: "38px",
  },
  {
    id: 2,
    currentHeight: "101px",
    previousHeight: "67px",
  },
  {
    id: 3,
    currentHeight: "122px",
    previousHeight: "92px",
  },
  {
    id: 4,
    currentHeight: "85px",
    previousHeight: "44px",
  },
  {
    id: 5,
    currentHeight: "50px",
    previousHeight: "31px",
  },
  {
    id: 6,
    currentHeight: "106px",
    previousHeight: "80px",
  },
];

export const transition = { duration: 0, ease: [0, 0, 0, 0] };
export const variants = {
  hidden: { transform: "translateY(0)", opacity: 1 },
  visible: { transform: "translateY(0)", opacity: 1 },
};
export const cardVariants = {
  hidden: { opacity: 1, transform: "scale(1) rotate(0deg)" },
  visible: { opacity: 1, transform: "scale(1) rotate(0deg)" },
};

export const FAQData = [
  {
    title: "What is the purpose of this website?",
    description: "Our AI-powered interview platform helps you make better hiring decisions by automatically analyzing and documenting interviews. We transform conversations into actionable insights, helping you identify top talent efficiently and objectively.",
  },
  {
    title: "How do i contact support?",
    description: "Our support team is ready to help you get the most out of our AI interview platform. Contact us through our in-app chat, email us at help@company.com, or schedule a personalized demo. We're here to ensure your success.",
  },
  {
    title: "How do I find the best products?",
    description: "Explore our range of AI-powered interview tools in your dashboard. From real-time transcription to candidate assessment, each feature is designed to streamline your hiring process. Our team can guide you to the features that best match your needs.",
  },
  {
    title: "Can I return a product?",
    description: "Start with our no-risk free trial to experience the full platform. You can cancel anytime during the trial period. For paid subscriptions, we offer flexible terms and our team will ensure a smooth transition if you decide to cancel.",
  },
  {
    title: "Do you offer international shipping?",
    description: "Our platform is accessible worldwide with multi-language support for interview analysis. We use regional servers to ensure fast performance and maintain strict compliance with international data protection standards.",
  },
  {
    title: "How can I track my order?",
    description: "Access your interview dashboard to track all activities in real-time. View transcripts, analyze candidate performance, and manage your hiring pipeline from one central location. Enable notifications to stay updated on important developments.",
  }
];

// World Map data
export const WorldMapDotsData = [
  {
    start: {
      lat: 60.2008,
      lng: -149.4937,
    },
    end: {
      lat: -21.7975,
      lng: -60.8919,
    },
  },
  {
    start: { lat: 60.2008, lng: -149.4937 },
    end: { lat: 75.7975, lng: -42.8919 },
  },
  {
    start: { lat: -21.7975, lng: -60.8919 },
    end: { lat: 4.7223, lng: 16.1393 },
  },
  {
    start: {
      lat: 70.7975,
      lng: -42.8919,
    },
    end: {
      lat: 4.7223,
      lng: 16.1393,
    },
  },
  {
    start: {
      lat: 65.5074,
      lng: 100.1278,
    },
    end: {
      lat: 75.7975,
      lng: -42.8919,
    },
  },
  {
    start: {
      lat: 4.7223,
      lng: 16.1393,
    },
    end: {
      lat: 65.5074,
      lng: 100.1278,
    },
  },
  {
    start: {
      lat: 10.5074,
      lng: 95.1278,
    },
    end: {
      lat: 4.7223,
      lng: 16.1393,
    },
  },
];

export const WorldMapAvatarsData = [
  {
    lat: 60.2008,
    lng: -149.4937,
    url: "/assets/avatar/avatar1.png",
    size: 20,
  },
  {
    lat: -21.7975,
    lng: -60.8919,
    url: "/assets/avatar/avatar2.png",
    size: 26,
  },
  {
    lat: 75.7975,
    lng: -42.8919,
    url: "/assets/avatar/avatar3.png",
    size: 28,
  },
  {
    lat: 4.7223,
    lng: 16.1393,
    url: "/assets/avatar/avatar4.png",
    size: 30,
  },
  {
    lat: 65.5074,
    lng: 100.1278,
    url: "/assets/avatar/avatar5.png",
    size: 35,
  },
  {
    lat: 10.5074,
    lng: 95.1278,
    url: "/assets/avatar/avatar6.png",
    size: 19,
  },
];
