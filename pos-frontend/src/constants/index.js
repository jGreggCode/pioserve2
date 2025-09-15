/*
 * Licensed Software - Property of John Gregg Felicisimo / JGDDEV
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

// Top Dish Images
const bakedSalmon = "/Dishes/Mains/Baked Salmon Florentine.jpg";
const beefSalpicao = "/Dishes/Mains/Beef Salpicao.jpg";
const chickenMarsala = "/Dishes/Mains/Chicken Marsala.jpg"
const brie = "/Dishes/Cold Cuts and Cheese/Brie.jpg"
const bakedBrie = "/Dishes/Starters/Baked Brie.jpg"
const calamari = "/Dishes/Starters/Calamari.jpg"
const croquettasPollo = "/Dishes/Starters/Croquettas Pollo.jpg"
const croquettasTrufa = "/Dishes/Starters/Croquettas Trufa.jpg"
const jardinCharcuterie = "/Dishes/Starters/Jardin Charcuterie.jpg"
const panDeAjo = "/Dishes/Starters/Pan de ajo.jpg"

export const popularDishes = [
    {
      id: 1,
      image: bakedSalmon,
      name: 'Baked Salmon Florentine',
      numberOfOrders: 250,
    },
    {
      id: 2,
      image: beefSalpicao,
      name: 'Beef Salpicao',
      numberOfOrders: 190,
    },
    {
      id: 3,
      image: chickenMarsala,
      name: 'Chicken Marsala',
      numberOfOrders: 300,
    },
    {
      id: 4,
      image: brie,
      name: 'Brie',
      numberOfOrders: 220,
    },
    {
      id: 5,
      image: bakedBrie,
      name: 'Baked Brie',
      numberOfOrders: 270,
    },
    {
      id: 6,
      image: calamari,
      name: 'Calamari',
      numberOfOrders: 180,
    },
    {
      id: 7,
      image: croquettasPollo,
      name: 'Croquettas Pollo',
      numberOfOrders: 210,
    },
    {
      id: 8,
      image: croquettasTrufa,
      name: 'Croquettas Trufa',
      numberOfOrders: 310,
    },
    {
      id: 9,
      image: jardinCharcuterie,
      name: 'Jardin Charcuterie',
      numberOfOrders: 140,
    },
    {
      id: 10,
      image: panDeAjo,
      name: 'Pan De Ajo',
      numberOfOrders: 160,
    },
];

export const tables = [
    { id: 1, name: "Table 1", status: "Booked", initial: "AM", seats: 4 },
    { id: 2, name: "Table 2", status: "Available", initial: "MB", seats: 6 },
    { id: 3, name: "Table 3", status: "Booked", initial: "JS", seats: 2 },
    { id: 4, name: "Table 4", status: "Available", initial: "HR", seats: 4 },
    { id: 5, name: "Table 5", status: "Booked", initial: "PL", seats: 3 },
    { id: 6, name: "Table 6", status: "Available", initial: "RT", seats: 4 },
    { id: 7, name: "Table 7", status: "Booked", initial: "LC", seats: 5 },
    { id: 8, name: "Table 8", status: "Available", initial: "DP", seats: 5 },
    { id: 9, name: "Table 9", status: "Booked", initial: "NK", seats: 6 },
    { id: 10, name: "Table 10", status: "Available", initial: "SB", seats: 6 },
    { id: 11, name: "Table 11", status: "Booked", initial: "GT", seats: 4 },
    { id: 12, name: "Table 12", status: "Available", initial: "JS", seats: 6 },
    { id: 13, name: "Table 13", status: "Booked", initial: "EK", seats: 2 },
    { id: 14, name: "Table 14", status: "Available", initial: "QN", seats: 6 },
    { id: 15, name: "Table 15", status: "Booked", initial: "TW", seats: 3 }
];
  
export const startersItem = [
    {
      id: 1,
      name: "Pan de Ajo",
      price: 298,
      category: "Vegetarian"
    },
    {
      id: 2,
      name: "Chicken Tikka",
      price: 300,
      category: "Non-Vegetarian"
    },
    {
      id: 3,
      name: "Tandoori Chicken",
      price: 350,
      category: "Non-Vegetarian"
    },
    {
      id: 4,
      name: "Samosa",
      price: 100,
      category: "Vegetarian"
    },
    {
      id: 5,
      name: "Aloo Tikki",
      price: 120,
      category: "Vegetarian"
    },
    {
      id: 6,
      name: "Hara Bhara Kebab",
      price: 220,
      category: "Vegetarian"
    }
];
  
export const mainCourse = [
  {
    id: 1,
    name: "Butter Chicken",
    price: 400,
    category: "Non-Vegetarian"
  },
  {
    id: 2,
    name: "Paneer Butter Masala",
    price: 350,
    category: "Vegetarian"
  },
  {
    id: 3,
    name: "Chicken Biryani",
    price: 450,
    category: "Non-Vegetarian"
  },
  {
    id: 4,
    name: "Dal Makhani",
    price: 180,
    category: "Vegetarian"
  },
  {
    id: 5,
    name: "Kadai Paneer",
    price: 300,
    category: "Vegetarian"
  },
  {
    id: 6,
    name: "Rogan Josh",
    price: 500,
    category: "Non-Vegetarian"
  }
];

export const beverages = [
  {
    id: 1,
    name: "Masala Chai",
    price: 50,
    category: "Hot"
  },
  {
    id: 2,
    name: "Lemon Soda",
    price: 80,
    category: "Cold"
  },
  {
    id: 3,
    name: "Mango Lassi",
    price: 120,
    category: "Cold"
  },
  {
    id: 4,
    name: "Cold Coffee",
    price: 150,
    category: "Cold"
  },
  {
    id: 5,
    name: "Fresh Lime Water",
    price: 60,
    category: "Cold"
  },
  {
    id: 6,
    name: "Iced Tea",
    price: 100,
    category: "Cold"
  }
];

export const soups = [
  {
    id: 1,
    name: "Tomato Soup",
    price: 120,
    category: "Vegetarian"
  },
  {
    id: 2,
    name: "Sweet Corn Soup",
    price: 130,
    category: "Vegetarian"
  },
  {
    id: 3,
    name: "Hot & Sour Soup",
    price: 140,
    category: "Vegetarian"
  },
  {
    id: 4,
    name: "Chicken Clear Soup",
    price: 160,
    category: "Non-Vegetarian"
  },
  {
    id: 5,
    name: "Mushroom Soup",
    price: 150,
    category: "Vegetarian"
  },
  {
    id: 6,
    name: "Lemon Coriander Soup",
    price: 110,
    category: "Vegetarian"
  }
];

export const desserts = [
  {
    id: 1,
    name: "Gulab Jamun",
    price: 100,
    category: "Vegetarian"
  },
  {
    id: 2,
    name: "Kulfi",
    price: 150,
    category: "Vegetarian"
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    price: 250,
    category: "Vegetarian"
  },
  {
    id: 4,
    name: "Ras Malai",
    price: 180,
    category: "Vegetarian"
  }
];

export const pizzas = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 350,
    category: "Vegetarian"
  },
  {
    id: 2,
    name: "Veg Supreme Pizza",
    price: 400,
    category: "Vegetarian"
  },
  {
    id: 3,
    name: "Pepperoni Pizza",
    price: 450,
    category: "Non-Vegetarian"
  }
];

export const alcoholicDrinks = [
  {
    id: 1,
    name: "Beer",
    price: 200,
    category: "Alcoholic"
  },
  {
    id: 2,
    name: "Whiskey",
    price: 500,
    category: "Alcoholic"
  },
  {
    id: 3,
    name: "Vodka",
    price: 450,
    category: "Alcoholic"
  },
  {
    id: 4,
    name: "Rum",
    price: 350,
    category: "Alcoholic"
  },
  {
    id: 5,
    name: "Tequila",
    price: 600,
    category: "Alcoholic"
  },
  {
    id: 6,
    name: "Cocktail",
    price: 400,
    category: "Alcoholic"
  }
];

export const salads = [
  {
    id: 1,
    name: "Caesar Salad",
    price: 200,
    category: "Vegetarian"
  },
  {
    id: 2,
    name: "Greek Salad",
    price: 250,
    category: "Vegetarian"
  },
  {
    id: 3,
    name: "Fruit Salad",
    price: 150,
    category: "Vegetarian"
  },
  {
    id: 4,
    name: "Chicken Salad",
    price: 300,
    category: "Non-Vegetarian"
  },
  {
    id: 5,
    name: "Tuna Salad",
    price: 350,
  
  }
];

export const hotBeverages = [
  {
    id: 1,
    name: "Espresso",
    price: 90,
    category: "Coffee Based"
  }, 
  {
    id: 2,
    name: "Espresso con Panna",
    price: 108,
    category: "Coffee Based"
  }, 
  {
    id: 3,
    name: "Espresso Machiatto",
    price: 108,
    category: "Coffee Based"
  }, 
  {
    id: 4,
    name: "Americano",
    price: 108,
    category: "Coffee Based"
  },
  {
    id: 5,
    name: "Capuccino",
    price: 128,
    category: "Coffee Based"
  },
  {
    id: 6,
    name: "Cafe Latte",
    price: 148,
    category: "Coffee Based"
  },
  {
    id: 7,
    name: "Caramel Machiatto",
    price: 158,
    category: "Coffee Based"
  },
  {
    id: 8,
    name: "Cafe Con Tros Leches",
    price: 168,
    category: "Coffee Based"
  },
  {
    id: 9,
    name: "Cafe Bombon",
    price: 158,
    category: "Coffee Based"
  },
  
  {
    id: 10,
    name: "White Mocha",
    price: 168,
    category: "Coffee Based"
  },
  
  {
    id: 11,
    name: "Black Nutty Latte",
    price: 168,
    category: "Coffee Based"
  },
  {
    id: 12,
    name: "Biscof Latte",
    price: 168,
    category: "Coffee Based"
  },
  {
    id: 13,
    name: "Creamy Hot Chocolate",
    price: 208,
    category: "Non Coffee Based"
  },
  {
    id: 14,
    name: "Nutella Hot Chocolate",
    price: 168,
    category: "Non Coffee Based"
  },
  {
    id: 15,
    name: "Spanish Flaming Coffee",
    price: 280,
    category: "Alcohol Based Coffee"
  },
  {
    id: 16,
    name: "Padre Pio Flaming Coffee",
    price: 280,
    category: "Alcohol Based Coffee"
  },
  {
    id: 17,
    name: "Itallian Falming Coffee",
    price: 280,
    category: "Alcohol Based Coffee"
  },
]

export const coldBeverages = [
  {
    id: 1,
    name: "Shakerato",
    price: 178,
    category: "Coffee Based"
  }, 
  {
    id: 2,
    name: "Black Mocha Mint",
    price: 188,
    category: "Coffee Based"
  }, 
  {
    id: 3,
    name: "Iced Caramel Machiatto",
    price: 178,
    category: "Coffee Based"
  }, 
  {
    id: 4,
    name: "Iced Nutty Biscof Latte",
    price: 188,
    category: "Coffee Based"
  }, 
  {
    id: 5,
    name: "Coke",
    price: 80,
    category: "Soda"
  }, 
  {
    id: 6,
    name: "Coke Zero",
    price: 80,
    category: "Soda"
  }, 
  {
    id: 7,
    name: "Sprite",
    price: 80,
    category: "Soda"
  }, 
  {
    id: 8,
    name: "Royal",
    price: 80,
    category: "Soda"
  }, 
  {
    id: 9,
    name: "Ginger Ale",
    price: 120,
    category: "Soda"
  }, 
  {
    id: 10,
    name: "Aranciata",
    price: 150,
    category: "Soda"
  }, 
  {
    id: 11,
    name: "Aranciata Rossa",
    price: 150,
    category: "Soda"
  }, 
  {
    id: 12,
    name: "Limonata",
    price: 150,
    category: "Soda"
  }, 
  {
    id: 13,
    name: "Acqua Panna 500ml",
    price: 150,
    category: "Water"
  }, 
  {
    id: 14,
    name: "Bottled Water 500ml",
    price: 40,
    category: "Soda"
  }, 
  {
    id: 15,
    name: "San Pollogrino 500ml",
    price: 160,
    category: "Soda"
  }, 
]

export const juiceAndShakes = [
  {
    id: 1,
    name: "Mango",
    price: 188,
    category: "Fruit Shakes"
  }, 
  {
    id: 2,
    name: "Banana",
    price: 288,
    category: "Fruit Shakes"
  }, 
  {
    id: 3,
    name: "Watermelon",
    price: 188,
    category: "Fruit Shakes"
  }, 
  {
    id: 4,
    name: "Dalandan",
    price: 188,
    category: "Fruit Shakes"
  },
  {
    id: 5,
    name: "Strawberry",
    price: 188,
    category: "Fruit Shakes"
  }, 
  {
    id: 6,
    name: "Mango",
    price: 188,
    category: "Fruit Juice"
  }, 
  {
    id: 7,
    name: "Orange",
    price: 188,
    category: "Fruit Juice"
  }, 
  {
    id: 8,
    name: "Lemonade",
    price: 188,
    category: "Fruit Juice"
  }, 
  {
    id: 9,
    name: "Grapefruit",
    price: 188,
    category: "Fruit Juice"
  }, 
  {
    id: 10,
    name: "Green Apple",
    price: 188,
    category: "Fruit Juice"
  }, 
  {
    id: 11,
    name: "Dalandan",
    price: 188,
    category: "Fruit Juice"
  },  
  {
    id: 12,
    name: "Limonata",
    price: 180,
    category: "Limonata Alla Fruta"
  }, 
  {
    id: 13,
    name: "Limonada",
    price: 180,
    category: "Limonata Alla Fruta"
  },  
  {
    id: 14,
    name: "Maracuja Pompelmo",
    price: 190,
    category: "Limonata Alla Fruta"
  },  
  {
    id: 15,
    name: "Mango Posca",
    price: 190,
    category: "Limonata Alla Fruta"
  },  
  {
    id: 16,
    name: "Fragola Basillico",
    price: 190,
    category: "Limonata Alla Fruta"
  },  
  {
    id: 17,
    name: "Fragola Pompelmo",
    price: 190,
    category: "Limonata Alla Fruta"
  }, 
]

export const alcoholDrinks = [
  {
    id: 1,
    name: "Corona (Mexico)",
    price: 220,
    category: "Beer"
  }, 
  {
    id: 2,
    name: "Peroni (Italy)",
    price: 220,
    category: "Beer"
  }, 
  {
    id: 3,
    name: "Corona (Mexico)",
    price: 220,
    category: "Beer"
  }, 
  {
    id: 4,
    name: "Corona (Mexico)",
    price: 220,
    category: "Beer"
  }, 
  {
    id: 5,
    name: "Corona (Mexico)",
    price: 220,
    category: "Beer"
  }, 
  {
    id: 6,
    name: "Corona (Mexico)",
    price: 220,
    category: "Beer"
  }, 
  {
    id: 7,
    name: "Corona (Mexico)",
    price: 220,
    category: "Beer"
  }, 
  {
    id: 8,
    name: "Corona (Mexico)",
    price: 220,
    category: "Beer"
  }, 
]

export const menus = [
  { id: 1, name: "Hot Beverages", bgColor: "#f56f21" ,icon: "", items: hotBeverages },
  { id: 2, name: "Cold Beverages", bgColor: "#f56f21" ,icon: "", items: coldBeverages },
  { id: 3, name: "Juice & Shakes", bgColor: "#f56f21" ,icon: "", items: juiceAndShakes },
  { id: 4, name: "Alcohol Drinks", bgColor: "#f56f21" ,icon: "", items: alcoholDrinks },
  { id: 5, name: "Cocktails", bgColor: "#f56f21" ,icon: "", items: desserts },
  { id: 6, name: "Dessers", bgColor: "#f56f21" ,icon: "", items: pizzas },
]

export const metricsData = [
  { title: "Revenue", value: "P50,846.90", percentage: "12%", color: "#025cca", isIncrease: false },
  { title: "Outbound Clicks", value: "10,342", percentage: "16%", color: "#02ca3a", isIncrease: true },
  { title: "Total Customer", value: "19,720", percentage: "10%", color: "#f6b100", isIncrease: true },
];

export const itemsData = [
  { title: "Total Categories", value: "8", percentage: "12%", color: "#5b45b0", isIncrease: false },
  { title: "Total Dishes", value: "50", percentage: "12%", color: "#285430", isIncrease: true },
  { title: "Active Orders", value: "12", percentage: "12%", color: "#735f32", isIncrease: true },
  { title: "Total Tables", value: "10", color: "#7f167f"}
];

export const orders = [
  {
    id: "101",
    customer: "Amrit Raj",
    status: "Ready",
    dateTime: "January 18, 2025 08:32 PM",
    items: 8,
    tableNo: 3,
    total: 250.0,
  },
  {
    id: "102",
    customer: "John Doe",
    status: "In Progress",
    dateTime: "January 18, 2025 08:45 PM",
    items: 5,
    tableNo: 4,
    total: 180.0,
  },
  {
    id: "103",
    customer: "Emma Smith",
    status: "Ready",
    dateTime: "January 18, 2025 09:00 PM",
    items: 3,
    tableNo: 5,
    total: 120.0,
  },
  {
    id: "104",
    customer: "Chris Brown",
    status: "In Progress",
    dateTime: "January 18, 2025 09:15 PM",
    items: 6,
    tableNo: 6,
    total: 220.0,
  },
];