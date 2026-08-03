import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// Student data with geographic coordinates
const students = [
  {
    name: "Sarah",
    location: "San Francisco, USA",
    role: "Product Manager",
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    name: "Carlos",
    location: "São Paulo, Brazil",
    role: "UX Designer",
    lat: -23.5505,
    lng: -46.6333,
  },
  {
    name: "Emma",
    location: "London, UK",
    role: "Content Strategist",
    lat: 51.5074,
    lng: -0.1278,
  },
  {
    name: "Aisha",
    location: "Lagos, Nigeria",
    role: "Tech Lead",
    lat: 6.5244,
    lng: 3.3792,
  },
  {
    name: "Yuki",
    location: "Tokyo, Japan",
    role: "AI Engineer",
    lat: 35.6762,
    lng: 139.6503,
  },
  {
    name: "Priya",
    location: "Mumbai, India",
    role: "Data Scientist",
    lat: 19.076,
    lng: 72.8777,
  },
  {
    name: "Lucas",
    location: "Sydney, Australia",
    role: "Startup Founder",
    lat: -33.8688,
    lng: 151.2093,
  },
  {
    name: "Anna",
    location: "Berlin, Germany",
    role: "UX Writer",
    lat: 52.52,
    lng: 13.405,
  },
  {
    name: "Michael",
    location: "Toronto, Canada",
    role: "Marketing Director",
    lat: 43.6532,
    lng: -79.3832,
  },
  {
    name: "Sofia",
    location: "Mexico City, Mexico",
    role: "Product Designer",
    lat: 19.4326,
    lng: -99.1332,
  },
  {
    name: "Jin",
    location: "Seoul, South Korea",
    role: "ML Engineer",
    lat: 37.5665,
    lng: 126.978,
  },
  {
    name: "Fatima",
    location: "Dubai, UAE",
    role: "Innovation Lead",
    lat: 25.2048,
    lng: 55.2708,
  },
  // Additional students for more global coverage
  {
    name: "Anders",
    location: "Stockholm, Sweden",
    role: "CTO",
    lat: 59.3293,
    lng: 18.0686,
  },
  {
    name: "Chen",
    location: "Shanghai, China",
    role: "Product Lead",
    lat: 31.2304,
    lng: 121.4737,
  },
  {
    name: "Olga",
    location: "Moscow, Russia",
    role: "Senior Developer",
    lat: 55.7558,
    lng: 37.6173,
  },
  {
    name: "Pierre",
    location: "Paris, France",
    role: "Design Director",
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    name: "Maria",
    location: "Buenos Aires, Argentina",
    role: "Growth Lead",
    lat: -34.6037,
    lng: -58.3816,
  },
  {
    name: "Kofi",
    location: "Accra, Ghana",
    role: "Engineering Manager",
    lat: 5.6037,
    lng: -0.187,
  },
  {
    name: "Nadia",
    location: "Cairo, Egypt",
    role: "AI Researcher",
    lat: 30.0444,
    lng: 31.2357,
  },
  {
    name: "Hassan",
    location: "Nairobi, Kenya",
    role: "Founder",
    lat: -1.2921,
    lng: 36.8219,
  },
  {
    name: "Lisa",
    location: "Auckland, NZ",
    role: "Product Manager",
    lat: -36.8509,
    lng: 174.7645,
  },
  {
    name: "Viktor",
    location: "Warsaw, Poland",
    role: "Tech Lead",
    lat: 52.2297,
    lng: 21.0122,
  },
  {
    name: "Elena",
    location: "Madrid, Spain",
    role: "UX Lead",
    lat: 40.4168,
    lng: -3.7038,
  },
  {
    name: "Raj",
    location: "Bangalore, India",
    role: "Staff Engineer",
    lat: 12.9716,
    lng: 77.5946,
  },
];

// Connection pairs (indices of students to connect)
const connections = [
  [0, 8], // SF to Toronto
  [1, 16], // São Paulo to Buenos Aires
  [2, 7], // London to Berlin
  [4, 10], // Tokyo to Seoul
  [5, 23], // Mumbai to Bangalore
  [3, 17], // Lagos to Accra
  [15, 2], // Paris to London
  [13, 4], // Shanghai to Tokyo
  [12, 21], // Stockholm to Warsaw
  [18, 19], // Cairo to Nairobi
];

// Convert lat/lng to 3D position on sphere
function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Detailed continent data as lat/lng point clouds for dotted effect
const continentPoints = [
  // North America - detailed coastline and interior
  ...[
    // West Coast
    [60, -140],
    [58, -138],
    [56, -133],
    [54, -130],
    [52, -128],
    [50, -127],
    [49, -126],
    [48, -124],
    [47, -124],
    [46, -124],
    [45, -124],
    [44, -124],
    [43, -124],
    [42, -124],
    [41, -124],
    [40, -124],
    [39, -123],
    [38, -123],
    [37, -122],
    [36, -122],
    [35, -121],
    [34, -120],
    [33, -118],
    [32, -117],
    [31, -116],
    [30, -115],
    [29, -114],
    [28, -113],
    [27, -112],
    [26, -111],
    // Mexico
    [25, -110],
    [24, -108],
    [23, -106],
    [22, -105],
    [21, -105],
    [20, -105],
    [19, -104],
    [18, -103],
    [17, -101],
    [16, -98],
    [15, -95],
    [16, -94],
    [17, -93],
    [18, -92],
    [19, -91],
    [20, -90],
    [21, -89],
    [22, -88],
    [23, -87],
    [24, -88],
    // Gulf Coast
    [25, -90],
    [26, -92],
    [27, -94],
    [28, -96],
    [29, -95],
    [30, -94],
    [29, -93],
    [30, -91],
    [30, -89],
    [29, -88],
    [30, -87],
    [30, -85],
    [29, -84],
    [28, -83],
    [27, -82],
    [26, -81],
    [25, -80],
    [26, -80],
    [27, -80],
    [28, -81],
    // East Coast
    [29, -81],
    [30, -81],
    [31, -81],
    [32, -81],
    [33, -79],
    [34, -78],
    [35, -76],
    [36, -76],
    [37, -76],
    [38, -75],
    [39, -75],
    [40, -74],
    [41, -73],
    [42, -71],
    [43, -70],
    [44, -69],
    [45, -67],
    [46, -66],
    [47, -65],
    [48, -64],
    // Canada East
    [49, -63],
    [50, -60],
    [51, -57],
    [52, -56],
    [53, -56],
    [54, -58],
    [55, -60],
    [56, -62],
    [57, -64],
    [58, -66],
    [59, -68],
    [60, -70],
    [61, -72],
    [62, -75],
    [63, -78],
    [64, -82],
    [65, -85],
    [66, -88],
    [67, -92],
    [68, -96],
    // Arctic
    [69, -100],
    [70, -105],
    [71, -110],
    [72, -115],
    [71, -120],
    [70, -125],
    [69, -130],
    [68, -135],
    [66, -140],
    [64, -142],
    [62, -142],
    [60, -145],
    [58, -148],
    [56, -150],
    [54, -158],
    [56, -160],
    [58, -162],
    [60, -165],
    [62, -165],
    [64, -162],
    [66, -160],
    [68, -158],
    [70, -155],
    [71, -150],
    [72, -145],
    [71, -140],
    [70, -135],
    [68, -130],
    [66, -128],
    [64, -130],
    // Interior points
    [45, -110],
    [46, -108],
    [47, -106],
    [48, -104],
    [49, -102],
    [50, -100],
    [51, -98],
    [52, -96],
    [53, -94],
    [54, -92],
    [40, -105],
    [42, -103],
    [44, -101],
    [46, -99],
    [48, -97],
    [50, -95],
    [52, -93],
    [54, -91],
    [56, -89],
    [58, -87],
    [35, -100],
    [37, -98],
    [39, -96],
    [41, -94],
    [43, -92],
    [45, -90],
    [47, -88],
    [49, -86],
    [51, -84],
    [53, -82],
    [38, -108],
    [40, -110],
    [42, -112],
    [44, -114],
    [46, -116],
    [48, -118],
    [50, -120],
    [52, -122],
    [54, -124],
    [32, -105],
    [34, -103],
    [36, -101],
    [38, -99],
    [40, -97],
    [42, -95],
    [44, -93],
    [46, -91],
    [48, -89],
    [55, -110],
    [56, -105],
    [57, -100],
    [58, -95],
    [59, -90],
    [60, -85],
    [61, -80],
    [62, -78],
    [63, -82],
  ],
  // South America - detailed
  ...[
    // North coast
    [12, -72],
    [11, -74],
    [10, -75],
    [9, -77],
    [8, -78],
    [7, -78],
    [6, -77],
    [5, -77],
    [4, -77],
    [3, -78],
    [2, -79],
    [1, -79],
    [0, -80],
    [-1, -80],
    [-2, -80],
    [-3, -80],
    [-4, -81],
    [-5, -81],
    [-6, -80],
    [-7, -79],
    // West coast
    [-8, -79],
    [-9, -79],
    [-10, -78],
    [-11, -77],
    [-12, -77],
    [-13, -76],
    [-14, -76],
    [-15, -75],
    [-16, -74],
    [-17, -72],
    [-18, -71],
    [-19, -70],
    [-20, -70],
    [-21, -70],
    [-22, -70],
    [-23, -70],
    [-24, -70],
    [-25, -71],
    [-26, -71],
    [-27, -71],
    [-28, -71],
    [-29, -71],
    [-30, -72],
    [-31, -72],
    [-32, -72],
    [-33, -72],
    [-34, -72],
    [-35, -72],
    [-36, -73],
    [-37, -73],
    [-38, -73],
    [-39, -73],
    [-40, -73],
    [-41, -73],
    [-42, -73],
    [-43, -74],
    [-44, -74],
    [-45, -74],
    [-46, -75],
    [-47, -75],
    [-48, -74],
    [-49, -74],
    [-50, -73],
    [-51, -72],
    [-52, -71],
    [-53, -70],
    [-54, -69],
    [-55, -68],
    [-54, -67],
    [-53, -68],
    // South and East coast
    [-52, -68],
    [-51, -69],
    [-50, -68],
    [-49, -66],
    [-48, -65],
    [-47, -64],
    [-46, -63],
    [-45, -62],
    [-44, -62],
    [-43, -62],
    [-42, -62],
    [-41, -62],
    [-40, -61],
    [-39, -60],
    [-38, -58],
    [-37, -57],
    [-36, -56],
    [-35, -55],
    [-34, -54],
    [-33, -53],
    [-32, -52],
    [-31, -51],
    [-30, -50],
    [-29, -49],
    [-28, -48],
    [-27, -48],
    [-26, -47],
    [-25, -46],
    [-24, -46],
    [-23, -45],
    [-22, -44],
    [-21, -43],
    [-20, -42],
    [-19, -41],
    [-18, -40],
    [-17, -39],
    [-16, -38],
    [-15, -38],
    [-14, -39],
    [-13, -39],
    [-12, -38],
    [-11, -37],
    [-10, -36],
    [-9, -35],
    [-8, -35],
    [-7, -35],
    [-6, -35],
    [-5, -35],
    [-4, -35],
    [-3, -36],
    [-2, -38],
    [-1, -40],
    [0, -42],
    [1, -45],
    [2, -48],
    [3, -52],
    [4, -55],
    [5, -58],
    [6, -60],
    [7, -62],
    [8, -64],
    [9, -66],
    [10, -68],
    [11, -70],
    // Interior
    [-5, -60],
    [-7, -58],
    [-9, -56],
    [-11, -54],
    [-13, -52],
    [-15, -50],
    [-17, -48],
    [-19, -46],
    [-21, -48],
    [-10, -65],
    [-12, -63],
    [-14, -61],
    [-16, -59],
    [-18, -57],
    [-20, -55],
    [-22, -53],
    [-24, -51],
    [-15, -68],
    [-17, -66],
    [-19, -64],
    [-21, -62],
    [-23, -60],
    [-25, -58],
    [-27, -56],
    [-29, -54],
    [-8, -70],
    [-10, -72],
    [-12, -70],
    [-14, -68],
    [-16, -66],
    [-18, -64],
    [-20, -62],
    [-22, -60],
    [-5, -55],
    [-7, -53],
    [-9, -51],
    [-11, -49],
    [-13, -47],
    [-15, -45],
    [-17, -43],
    [-19, -44],
  ],
  // Europe - detailed
  ...[
    // Iberian Peninsula
    [43, -8],
    [42, -9],
    [41, -9],
    [40, -9],
    [39, -9],
    [38, -9],
    [37, -8],
    [36, -6],
    [36, -5],
    [37, -4],
    [38, -3],
    [39, -2],
    [40, -1],
    [41, 0],
    [42, 1],
    [43, 2],
    [44, 3],
    [43, 4],
    [42, 3],
    [41, 2],
    [40, 1],
    [39, 0],
    [38, -1],
    [37, -2],
    [36, -4],
    [37, -6],
    [38, -7],
    [39, -8],
    [40, -8],
    [41, -7],
    // France
    [44, 4],
    [45, 5],
    [46, 4],
    [47, 3],
    [48, 2],
    [49, 1],
    [50, 2],
    [51, 2],
    [50, 3],
    [49, 4],
    [48, 5],
    [47, 6],
    [46, 6],
    [45, 7],
    [44, 7],
    [43, 6],
    [43, 5],
    [44, 5],
    [45, 4],
    [46, 3],
    // British Isles
    [50, -5],
    [51, -4],
    [52, -3],
    [53, -3],
    [54, -3],
    [55, -4],
    [56, -5],
    [57, -5],
    [58, -4],
    [58, -3],
    [57, -2],
    [56, -2],
    [55, -1],
    [54, 0],
    [53, 0],
    [52, 1],
    [51, 1],
    [50, 0],
    [51, -1],
    [52, -2],
    [53, -4],
    [54, -5],
    [55, -6],
    [54, -6],
    [53, -7],
    [52, -8],
    [51, -9],
    [52, -10],
    [53, -10],
    [54, -8],
    // Scandinavia
    [56, 8],
    [57, 9],
    [58, 10],
    [59, 10],
    [60, 10],
    [61, 10],
    [62, 10],
    [63, 11],
    [64, 13],
    [65, 14],
    [66, 15],
    [67, 16],
    [68, 18],
    [69, 20],
    [70, 22],
    [70, 25],
    [69, 27],
    [68, 28],
    [67, 26],
    [66, 24],
    [65, 22],
    [64, 20],
    [63, 18],
    [62, 16],
    [61, 14],
    [60, 12],
    [59, 11],
    [58, 11],
    [57, 10],
    [60, 5],
    [61, 6],
    [62, 7],
    [63, 9],
    [64, 11],
    [65, 12],
    [66, 13],
    [67, 14],
    [68, 16],
    [69, 18],
    // Central Europe
    [47, 7],
    [48, 8],
    [49, 10],
    [50, 12],
    [51, 14],
    [52, 14],
    [53, 14],
    [54, 13],
    [55, 12],
    [54, 10],
    [53, 9],
    [52, 8],
    [51, 7],
    [50, 7],
    [49, 8],
    [48, 9],
    [47, 10],
    [46, 11],
    [45, 12],
    [44, 12],
    [46, 14],
    [47, 15],
    [48, 16],
    [49, 17],
    [50, 18],
    [51, 17],
    [52, 16],
    [53, 16],
    [54, 18],
    [55, 20],
    // Eastern Europe
    [50, 20],
    [51, 22],
    [52, 24],
    [53, 24],
    [54, 24],
    [55, 24],
    [56, 24],
    [57, 26],
    [58, 28],
    [59, 30],
    [60, 30],
    [61, 28],
    [60, 26],
    [59, 24],
    [58, 22],
    [57, 20],
    [56, 18],
    [55, 16],
    [54, 16],
    [53, 18],
    // Italy
    [46, 11],
    [45, 10],
    [44, 10],
    [43, 11],
    [42, 12],
    [41, 14],
    [40, 15],
    [39, 16],
    [38, 16],
    [37, 15],
    [38, 13],
    [39, 14],
    [40, 13],
    [41, 12],
    [42, 11],
    [43, 10],
    [44, 9],
    [45, 8],
    [46, 8],
    [46, 9],
    // Balkans/Greece
    [45, 14],
    [44, 16],
    [43, 18],
    [42, 20],
    [41, 22],
    [40, 22],
    [39, 22],
    [38, 23],
    [37, 24],
    [36, 25],
    [35, 24],
    [36, 22],
    [37, 21],
    [38, 20],
    [39, 19],
    [40, 18],
    [41, 17],
    [42, 16],
    [43, 15],
    [44, 14],
  ],
  // Africa - detailed
  ...[
    // North Africa
    [35, -6],
    [34, -4],
    [33, -2],
    [32, 0],
    [31, 2],
    [30, 4],
    [31, 6],
    [32, 8],
    [33, 10],
    [34, 10],
    [35, 10],
    [36, 10],
    [37, 10],
    [37, 11],
    [36, 12],
    [35, 12],
    [34, 12],
    [33, 12],
    [32, 11],
    [31, 10],
    [30, 10],
    [29, 12],
    [28, 14],
    [27, 16],
    [26, 18],
    [25, 20],
    [24, 22],
    [23, 24],
    [22, 26],
    [21, 28],
    // West Africa
    [20, -17],
    [19, -16],
    [18, -16],
    [17, -16],
    [16, -16],
    [15, -17],
    [14, -17],
    [13, -16],
    [12, -16],
    [11, -15],
    [10, -14],
    [9, -13],
    [8, -12],
    [7, -11],
    [6, -10],
    [5, -8],
    [4, -6],
    [5, -4],
    [6, -2],
    [7, 0],
    [8, 2],
    [7, 4],
    [6, 6],
    [5, 8],
    [4, 9],
    [5, 10],
    [6, 10],
    [7, 10],
    [8, 10],
    [9, 10],
    [10, 10],
    [11, 12],
    [12, 14],
    [13, 14],
    [14, 14],
    [15, 14],
    [16, 14],
    [17, 16],
    [18, 18],
    [19, 18],
    // East Africa
    [20, 35],
    [19, 37],
    [18, 38],
    [17, 40],
    [16, 42],
    [15, 44],
    [14, 45],
    [13, 46],
    [12, 47],
    [11, 48],
    [10, 49],
    [9, 48],
    [8, 47],
    [7, 46],
    [6, 45],
    [5, 44],
    [4, 42],
    [3, 40],
    [2, 38],
    [1, 36],
    [0, 34],
    [-1, 35],
    [-2, 37],
    [-3, 38],
    [-4, 39],
    [-5, 40],
    [-6, 40],
    [-7, 39],
    [-8, 38],
    [-9, 37],
    [-10, 36],
    [-11, 38],
    [-12, 40],
    [-13, 40],
    [-14, 38],
    [-15, 36],
    [-16, 34],
    [-15, 32],
    [-14, 30],
    // Central Africa
    [5, 12],
    [4, 14],
    [3, 16],
    [2, 18],
    [1, 20],
    [0, 22],
    [-1, 24],
    [-2, 26],
    [-3, 28],
    [-4, 28],
    [-5, 26],
    [-6, 24],
    [-7, 22],
    [-8, 20],
    [-9, 18],
    [-10, 16],
    [-11, 14],
    [-12, 16],
    [-13, 18],
    [0, 12],
    [-1, 14],
    [-2, 16],
    [-3, 18],
    [-4, 20],
    [-5, 22],
    [-6, 24],
    [-7, 26],
    [-8, 28],
    // Southern Africa
    [-14, 26],
    [-15, 28],
    [-16, 30],
    [-17, 32],
    [-18, 33],
    [-19, 34],
    [-20, 34],
    [-21, 33],
    [-22, 32],
    [-23, 30],
    [-24, 28],
    [-25, 26],
    [-26, 24],
    [-27, 22],
    [-28, 20],
    [-29, 18],
    [-30, 18],
    [-31, 18],
    [-32, 20],
    [-33, 22],
    [-34, 24],
    [-34, 26],
    [-33, 28],
    [-32, 28],
    [-31, 28],
    [-30, 30],
    [-29, 32],
    [-28, 32],
    [-27, 32],
    [-26, 32],
    [-25, 32],
    [-24, 32],
    [-23, 34],
    [-22, 35],
    [-21, 35],
    [-20, 36],
    [-19, 36],
    [-18, 36],
    [-17, 38],
    [-16, 40],
    [-15, 40],
    [-14, 42],
    [-13, 44],
    [-12, 45],
    [-11, 44],
    // Interior
    [15, 0],
    [14, 2],
    [13, 4],
    [12, 6],
    [11, 8],
    [10, 6],
    [9, 4],
    [8, 2],
    [7, 0],
    [6, -2],
    [-5, 18],
    [-6, 20],
    [-7, 22],
    [-8, 24],
    [-9, 26],
    [-10, 28],
    [-11, 30],
    [-12, 32],
    [-13, 34],
    [-20, 22],
    [-21, 24],
    [-22, 26],
    [-23, 28],
    [-24, 30],
    [-25, 30],
    [-26, 28],
    [-27, 26],
    [-28, 24],
  ],
  // Asia - detailed
  ...[
    // Middle East
    [35, 35],
    [34, 36],
    [33, 36],
    [32, 35],
    [31, 34],
    [30, 33],
    [29, 34],
    [28, 36],
    [27, 38],
    [26, 40],
    [25, 42],
    [24, 44],
    [23, 46],
    [22, 48],
    [21, 50],
    [20, 52],
    [19, 54],
    [18, 55],
    [17, 54],
    [16, 52],
    [15, 50],
    [14, 48],
    [13, 46],
    [12, 44],
    [12, 46],
    [13, 48],
    [14, 50],
    [15, 52],
    [16, 54],
    [17, 56],
    // India
    [32, 70],
    [30, 72],
    [28, 74],
    [26, 76],
    [24, 78],
    [22, 80],
    [20, 82],
    [18, 84],
    [16, 82],
    [14, 80],
    [12, 78],
    [10, 76],
    [8, 77],
    [10, 78],
    [12, 80],
    [14, 82],
    [16, 84],
    [18, 86],
    [20, 88],
    [22, 88],
    [24, 86],
    [26, 84],
    [28, 82],
    [30, 80],
    [32, 78],
    [30, 76],
    [28, 74],
    [26, 72],
    [24, 70],
    [22, 72],
    [20, 74],
    [18, 76],
    [16, 78],
    [14, 78],
    [12, 76],
    [10, 74],
    [8, 72],
    [6, 80],
    [8, 82],
    [10, 84],
    // Southeast Asia
    [20, 100],
    [18, 102],
    [16, 104],
    [14, 106],
    [12, 108],
    [10, 106],
    [8, 104],
    [6, 102],
    [4, 100],
    [2, 102],
    [0, 104],
    [-2, 106],
    [-4, 108],
    [-6, 110],
    [-8, 112],
    [-8, 114],
    [-6, 116],
    [-4, 118],
    [-2, 120],
    [0, 118],
    [2, 116],
    [4, 114],
    [6, 112],
    [8, 110],
    [10, 112],
    [12, 114],
    [14, 112],
    [16, 110],
    [18, 108],
    [1, 104],
    [2, 106],
    [3, 108],
    [4, 110],
    [5, 112],
    [6, 114],
    [7, 116],
    [8, 118],
    [10, 120],
    // China
    [40, 80],
    [38, 82],
    [36, 84],
    [34, 86],
    [32, 88],
    [30, 90],
    [28, 92],
    [26, 94],
    [24, 96],
    [22, 98],
    [24, 100],
    [26, 102],
    [28, 104],
    [30, 106],
    [32, 108],
    [34, 110],
    [36, 112],
    [38, 114],
    [40, 116],
    [42, 118],
    [44, 120],
    [46, 122],
    [48, 124],
    [50, 126],
    [48, 128],
    [46, 130],
    [44, 128],
    [42, 126],
    [40, 124],
    [38, 122],
    [36, 120],
    [34, 118],
    [32, 116],
    [30, 114],
    [28, 112],
    [26, 110],
    [24, 108],
    [35, 100],
    [36, 102],
    [37, 104],
    [38, 106],
    [39, 108],
    [40, 110],
    [41, 112],
    [42, 114],
    [43, 116],
    [30, 100],
    [31, 102],
    [32, 104],
    [33, 106],
    [34, 108],
    [35, 110],
    [36, 112],
    [37, 114],
    [38, 116],
    // Japan
    [45, 140],
    [44, 142],
    [43, 144],
    [42, 144],
    [41, 142],
    [40, 140],
    [39, 140],
    [38, 138],
    [37, 138],
    [36, 140],
    [35, 140],
    [34, 136],
    [33, 132],
    [32, 130],
    [31, 130],
    [32, 132],
    [33, 134],
    [34, 136],
    [35, 138],
    [36, 140],
    [37, 140],
    [38, 140],
    [39, 142],
    [40, 144],
    [41, 146],
    [42, 146],
    [43, 146],
    // Korea
    [38, 128],
    [37, 127],
    [36, 127],
    [35, 128],
    [34, 128],
    [35, 129],
    [36, 129],
    [37, 129],
    [38, 130],
    [39, 128],
    [38, 126],
    [37, 126],
    [36, 126],
    [35, 126],
    [36, 125],
    [37, 125],
    [38, 125],
    [39, 126],
    // Russia/Siberia
    [55, 40],
    [56, 45],
    [57, 50],
    [58, 55],
    [59, 60],
    [60, 65],
    [61, 70],
    [62, 75],
    [63, 80],
    [64, 85],
    [65, 90],
    [66, 95],
    [67, 100],
    [68, 105],
    [69, 110],
    [70, 115],
    [71, 120],
    [70, 125],
    [69, 130],
    [68, 135],
    [67, 140],
    [66, 145],
    [65, 150],
    [64, 155],
    [63, 160],
    [62, 165],
    [61, 170],
    [60, 175],
    [55, 50],
    [56, 55],
    [57, 60],
    [58, 65],
    [59, 70],
    [60, 75],
    [61, 80],
    [62, 85],
    [63, 90],
    [50, 45],
    [51, 50],
    [52, 55],
    [53, 60],
    [54, 65],
    [55, 70],
    [56, 75],
    [57, 80],
    [58, 85],
    [45, 50],
    [46, 55],
    [47, 60],
    [48, 65],
    [49, 70],
    [50, 75],
    [51, 80],
    [52, 85],
    [53, 90],
    [50, 130],
    [52, 132],
    [54, 134],
    [56, 136],
    [58, 138],
    [60, 140],
    [62, 142],
    [64, 144],
    [66, 146],
  ],
  // Australia - detailed
  ...[
    // North coast
    [-12, 130],
    [-12, 132],
    [-12, 134],
    [-12, 136],
    [-11, 138],
    [-12, 140],
    [-13, 142],
    [-14, 144],
    [-15, 145],
    [-14, 143],
    [-13, 141],
    [-12, 139],
    [-11, 137],
    [-10, 135],
    [-11, 133],
    [-12, 131],
    [-13, 129],
    [-14, 127],
    // West coast
    [-15, 125],
    [-16, 123],
    [-18, 122],
    [-20, 119],
    [-22, 115],
    [-24, 114],
    [-26, 113],
    [-28, 114],
    [-30, 115],
    [-32, 116],
    [-34, 116],
    [-35, 117],
    [-34, 119],
    [-33, 121],
    [-32, 123],
    [-31, 125],
    [-30, 127],
    // South coast
    [-35, 118],
    [-35, 120],
    [-35, 122],
    [-35, 124],
    [-35, 126],
    [-35, 128],
    [-35, 130],
    [-35, 132],
    [-35, 134],
    [-35, 136],
    [-35, 138],
    [-36, 140],
    [-37, 142],
    [-38, 144],
    [-38, 146],
    [-37, 148],
    [-36, 149],
    // East coast
    [-35, 150],
    [-34, 151],
    [-33, 152],
    [-32, 152],
    [-31, 153],
    [-30, 153],
    [-29, 153],
    [-28, 153],
    [-27, 153],
    [-26, 153],
    [-25, 152],
    [-24, 151],
    [-23, 150],
    [-22, 150],
    [-21, 149],
    [-20, 148],
    [-19, 147],
    [-18, 146],
    [-17, 146],
    [-16, 145],
    [-15, 145],
    [-14, 144],
    [-13, 143],
    [-12, 142],
    [-11, 142],
    [-10, 142],
    // Interior
    [-22, 130],
    [-23, 132],
    [-24, 134],
    [-25, 136],
    [-26, 138],
    [-27, 140],
    [-28, 138],
    [-29, 136],
    [-30, 134],
    [-20, 125],
    [-21, 127],
    [-22, 129],
    [-23, 131],
    [-24, 133],
    [-25, 135],
    [-26, 137],
    [-27, 139],
    [-25, 125],
    [-26, 127],
    [-27, 129],
    [-28, 131],
    [-29, 133],
    [-30, 135],
    [-31, 137],
    [-32, 139],
    [-18, 135],
    [-19, 137],
    [-20, 139],
    [-21, 141],
    [-22, 143],
    [-23, 145],
    [-24, 147],
    [-25, 149],
    [-28, 142],
    [-29, 144],
    [-30, 146],
    [-31, 148],
    [-32, 150],
    [-33, 148],
    [-34, 146],
    [-35, 144],
    // Tasmania
    [-41, 145],
    [-42, 146],
    [-43, 147],
    [-42, 148],
    [-41, 147],
    [-40, 146],
    [-41, 145],
    // New Zealand
    [-35, 173],
    [-36, 174],
    [-37, 175],
    [-38, 176],
    [-39, 176],
    [-40, 176],
    [-41, 175],
    [-42, 174],
    [-43, 172],
    [-44, 170],
    [-45, 168],
    [-46, 167],
    [-45, 169],
    [-44, 171],
    [-43, 173],
    [-42, 174],
    [-37, 178],
    [-38, 178],
    [-39, 177],
    [-40, 177],
    [-41, 176],
    [-40, 175],
    [-39, 175],
    [-38, 176],
  ],
];

// Globe mesh component with world map
function Globe() {
  const meshRef = useRef<THREE.Group>(null);

  // Create dotted continent geometry
  const continentDotsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    continentPoints.forEach(([lat, lng]) => {
      const pos = latLngToVector3(lat, lng, 2.02);
      positions.push(pos.x, pos.y, pos.z);
    });

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    return geometry;
  }, []);

  // Custom shader material for globe with depth fade
  const globeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#000000") },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          // Vertical depth fade - fade out at bottom
          float yFade = smoothstep(-2.0, 0.5, vPosition.y);
          
          // Softer edge fade based on view angle
          float edgeFade = pow(abs(vNormal.z), 0.3);
          
          // Combine fades
          float alpha = yFade * 0.95;
          
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
    });
  }, []);

  // Subtle auto-rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main globe sphere with depth fade */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <primitive object={globeMaterial} attach="material" />
      </mesh>

      {/* Wireframe overlay for subtle grid effect - also with fade */}
      <mesh>
        <sphereGeometry args={[2.01, 32, 32]} />
        <shaderMaterial
          wireframe
          transparent
          uniforms={{ uColor: { value: new THREE.Color("#2d2d44") } }}
          vertexShader={`
            varying vec3 vPosition;
            void main() {
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            varying vec3 vPosition;
            void main() {
              float yFade = smoothstep(-2.0, 0.5, vPosition.y);
              gl_FragColor = vec4(uColor, yFade * 0.15);
            }
          `}
        />
      </mesh>

      {/* Subtle edge glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.95, 2.15, 64]} />
        <shaderMaterial
          transparent
          side={THREE.DoubleSide}
          uniforms={{
            uColor: { value: new THREE.Color("#f97316") },
            uGlowColor: { value: new THREE.Color("#fbbf24") },
          }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            uniform vec3 uGlowColor;
            varying vec2 vUv;
            void main() {
              // Create radial gradient from inner to outer edge
              float dist = abs(vUv.x - 0.5) * 2.0;
              float glow = 1.0 - smoothstep(0.0, 1.0, dist);
              glow = pow(glow, 2.0);
              
              // Mix colors for gradient effect
              vec3 color = mix(uGlowColor, uColor, dist);
              
              gl_FragColor = vec4(color, glow * 0.25);
            }
          `}
        />
      </mesh>
    </group>
  );
}

// Student pin component - renders a simple dot without any hover info
interface StudentPinProps {
  student: (typeof students)[0];
  index: number;
}

function StudentPin({ student, index }: StudentPinProps) {
  const position = latLngToVector3(student.lat, student.lng, 2.12);

  // Stagger the animation delay based on index for visual interest
  const pulseDelay = (index % 5) * 0.4;

  return (
    <group position={position}>
      <Html
        center
        zIndexRange={[1, 10]}
        style={{
          pointerEvents: "auto",
          cursor: "pointer",
        }}>
        <div className="relative">
          {/* Subtle dot - always visible as interaction hotspot */}
          <div
            className="w-2 h-2 rounded-full bg-primary/60"
            style={{
              boxShadow: "0 0 8px 3px hsl(var(--primary) / 0.4)",
            }}
          />
          {/* Subtle pulse on dot */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/30"
            style={{
              animation: `ping 3s cubic-bezier(0, 0, 0.2, 1) infinite`,
              animationDelay: `${pulseDelay}s`,
            }}
          />
        </div>
      </Html>
    </group>
  );
}

// Animated connection line component
function AnimatedConnectionLine({
  startIdx,
  endIdx,
  index,
}: {
  startIdx: number;
  endIdx: number;
  index: number;
}) {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOffset: { value: index * 0.3 },
        uColor1: { value: new THREE.Color("#f97316") }, // Primary orange
        uColor2: { value: new THREE.Color("#fbbf24") }, // Golden yellow
      },
      vertexShader: `
        attribute float lineProgress;
        varying float vProgress;
        void main() {
          vProgress = lineProgress;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOffset;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying float vProgress;
        
        void main() {
          // Create flowing pulse effect
          float pulse = sin((vProgress * 4.0 - uTime * 0.8 + uOffset) * 3.14159) * 0.5 + 0.5;
          
          // Mix colors based on pulse
          vec3 color = mix(uColor1, uColor2, pulse);
          
          // Fade at edges
          float edgeFade = smoothstep(0.0, 0.1, vProgress) * smoothstep(1.0, 0.9, vProgress);
          
          // Brightness pulse
          float brightness = 0.3 + pulse * 0.5;
          
          gl_FragColor = vec4(color * brightness, edgeFade * (0.4 + pulse * 0.4));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }, [index]);

  const lineObj = useMemo(() => {
    const start = latLngToVector3(
      students[startIdx].lat,
      students[startIdx].lng,
      2.12,
    );
    const end = latLngToVector3(
      students[endIdx].lat,
      students[endIdx].lng,
      2.12,
    );

    // Create curved path through arc above the globe
    const mid = start
      .clone()
      .add(end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(2.6);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(64);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Add custom attribute for animation
    const lineLength = points.length;
    const lineProgress = new Float32Array(lineLength);
    for (let i = 0; i < lineLength; i++) {
      lineProgress[i] = i / (lineLength - 1);
    }
    geometry.setAttribute(
      "lineProgress",
      new THREE.BufferAttribute(lineProgress, 1),
    );

    const line = new THREE.Line(geometry, shaderMaterial);
    return line;
  }, [startIdx, endIdx, shaderMaterial]);

  // Animate the shader
  useFrame((state) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return <primitive object={lineObj} />;
}

// Connection lines between students
function ConnectionLines() {
  return (
    <group>
      {connections.map(([startIdx, endIdx], i) => (
        <AnimatedConnectionLine
          key={i}
          startIdx={startIdx}
          endIdx={endIdx}
          index={i}
        />
      ))}
    </group>
  );
}

// Scene with all elements
function Scene() {
  const [isInteracting, setIsInteracting] = useState(false);
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Set initial camera position - push globe lower and slightly back
  useMemo(() => {
    camera.position.set(0, 2, 5.5);
  }, [camera]);

  // Keep auto-rotation active unless the user is interacting
  const shouldAutoRotate = !isInteracting;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.2} color="#f97316" />

      {/* Globe */}
      <Globe />

      {/* Student pins */}
      {students.map((student, index) => (
        <StudentPin key={index} student={student} index={index} />
      ))}

      {/* Connection lines */}
      <ConnectionLines />

      {/* Controls with auto-rotate */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        dampingFactor={0.05}
        enableDamping
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI - Math.PI / 4}
        autoRotate={shouldAutoRotate}
        autoRotateSpeed={0.5}
        onStart={() => setIsInteracting(true)}
        onEnd={() => setIsInteracting(false)}
      />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Main component
export default function InteractiveGlobe() {
  return (
    <div
      className="absolute inset-0"
      style={{
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
      }}>
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 100 }}
        style={{
          background: "transparent",
          width: "100%",
          height: "100%",
        }}
        gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
