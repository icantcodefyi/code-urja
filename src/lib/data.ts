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

export const FAQData: {
  title: string;
  description: string;
}[] = [
  {
    title: "What is the purpose of this website?",
    description:
      "Welcome to our website, where we aim to provide you with the best products and services. Our purpose is to make your life easier, by offering you a wide range of products that you can use to improve your daily life. We strive to provide you with the best quality products, at the best prices, and with the best customer service. We believe that our website is the best place for you to find what you need, and we are committed to making sure that you have a great experience while shopping with us.",
  },
  {
    title: "How do i contact support?",
    description:
      "If you have any questions or need any help, please don't hesitate to contact us. We have a dedicated team of customer support specialists who are ready to assist you with any questions or concerns you may have. You can reach us by phone, email, or through our website's contact form. We are available 24/7 to help you with any issue you may have.",
  },
  {
    title: "How do I find the best products?",
    description:
      "Finding the best products can be a challenge, but we are here to help. We have a team of experts who carefully curate our products to ensure that they are of the highest quality and meet our high standards. We also have a detailed product description, customer reviews, and product ratings to help you make an informed decision. If you still have any questions, feel free to contact us and we will be happy to help you.",
  },
  {
    title: "Can I return a product?",
    description:
      "Yes, you can return a product. We want you to be completely satisfied with your purchase, and if for any reason you are not, you can return it to us within 30 days of delivery. Please see our return policy for more details.",
  },
  {
    title: "Do you offer international shipping?",
    description:
      "Yes, we offer international shipping. We understand that our customers are located all over the world, and we want to make sure that we can reach them. We have a network of shipping partners that allow us to ship to almost any country in the world. Please see our shipping policy for more details.",
  },
  {
    title: "How can I track my order?",
    description:
      "Once your order has shipped, you will receive an email with tracking information. You can use this information to track your order and see when it will arrive. If you have any questions or concerns about your order, please don't hesitate to contact us.",
  },
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
