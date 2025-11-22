export type Product = {
  id: string;
  name: string;
  price: string;
  suggested: string;
  description: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "aceite20",
    name: "Aceite CBD 20 ml",
    price: "$18.000.-",
    suggested: "$36.000.-",
    description: "Extracto orgánico con dosificador, pensado para rutinas completas.",
    image: "/img/7.png",
  },
  {
    id: "pet10",
    name: "Aceite Pet 10 ml",
    price: "$14.000.-",
    suggested: "$28.000.-",
    description: "Línea Pet para perros y gatos, 8 mg/ml de CBD con pipeta dosificadora.",
    image: "/img/pet.jpeg",
  },
  {
    id: "crema50",
    name: "Crema CBD 50 cc",
    price: "$11.000.-",
    suggested: "$22.000.-",
    description: "Presentación de 50 cc para tratamientos tópicos y musculares.",
    image: "/img/6.png",
  },
  {
    id: "crema30",
    name: "Crema CBD 30 cc",
    price: "$8.000.-",
    suggested: "$16.000.-",
    description: "Formato compacto para uso diario en zonas localizadas.",
    image: "/img/6.png",
  },
];
