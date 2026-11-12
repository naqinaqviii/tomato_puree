import React, { useEffect, useRef, useState } from "react";
import {
  Leaf, Droplet, Truck, Menu, X, ChevronRight, ChevronLeft, Quote, ShieldCheck,
  Sun, Moon, Star, ArrowRight, Award, Eye, Sparkles, Box, RefreshCw
} from "lucide-react";
import { motion, useMotionValue, useTransform, animate, useInView, useScroll, useSpring } from "framer-motion";
import heritageImg from "./assets/tomato-puree-canned.jpg";
import { Hero3DCanvas, Product3DViewport, Lifecycle3DViewport, Wholesale3DViewport, Tech3DModelViewport, Navbar3DLogoCanvas } from "./components/ThreeCanvas";
import Inspect3DModal from "./components/3DInspectModal";

/* ---------- Data Sets & Constants ---------- */
const PRODUCTS = [
  {
    name: "Tomato Purée",
    tone: "tomato",
    featured: true,
    desc: "Made from ripe, carefully selected tomatoes to deliver rich flavor, vibrant color, and smooth consistency. Perfect for curries, sauces, soups, and gravies, our tomato purée adds natural taste and freshness to every dish.",
  },
  {
    name: "Tomato Ketchup",
    tone: "gold",
    desc: "A tangy, slow-cooked classic with just the right balance of sweet and spice — the everyday companion for fries, snacks, and family dinners.",
  },
  {
    name: "Tomato Paste",
    tone: "deep",
    desc: "Triple-concentrated for deep, savory flavor. A small spoon carries a whole pot of sun-ripened taste into your gravies and stews.",
  },
  {
    name: "Garlic Chili Sauce",
    tone: "tomato",
    desc: "Fresh red chilies and garlic, simmered together for a bold, versatile heat that works as dip, marinade, or stir-fry base.",
  },
];

const STEPS = [
  { n: "01", title: "Harvest", text: "Tomatoes are picked at peak ripeness, straight from the vine." },
  { n: "02", title: "Wash & sort", text: "Each batch is rinsed and sorted by hand for color and quality." },
  { n: "03", title: "Simmer & purée", text: "Slow-cooked to concentrate flavor without added water or fillers." },
  { n: "04", title: "Bottle & seal", text: "Sealed fresh to lock in taste, ready to leave the farm." },
];

const STATS = [
  { value: "100%", label: "Vine-ripened tomatoes" },
  { value: "0", label: "Artificial preservatives" },
  { value: "48hr", label: "Farm to jar" },
  { value: "30+", label: "Years of craft" },
];

const TECHNICAL_INFO = {
  summary: {
    title: "Product Summary",
    data: [
      { label: "Name", value: "Canned Whole Peeled Tomatoes" },
      { label: "Content", value: "Made from Fresh, Ripe, Tasty Tomatoes, Contains No GMO, Allergens, Coloring, Flavors or Preservatives." },
      { label: "Origin", value: "IRAN, Tehran" }
    ]
  },
  packaging: {
    title: "Packaging",
    data: [
      { label: "Metal Can (Tin)", value: "70gr, 200gr, 400gr, 800gr, 4kg" },
      { label: "Glass Jar", value: "300gr, 700gr, 1600gr" },
      { label: "Shell/Carton", value: "12, 24 Per Carton" }
    ]
  },
  specifications: {
    title: "Specifications",
    nutritionalValue: {
      serving: "Per 121g",
      values: [
        { name: "Calories", amount: "0g" },
        { name: "Carbohydrates", amount: "5g (2%)" },
        { name: "Protein", amount: "4.32g (18% of total calories)" },
        { name: "Fat", amount: "1g (2%)" },
        { name: "Potassium", amount: "229.9mg (5%)" },
        { name: "Sodium", amount: "119.8mg (5%)" }
      ]
    },
    data: [
      { label: "Ingredient", value: "100% Purity Tomatoes" },
      { label: "Shelf Life", value: "2 years from manufacturing date. Remaining shelf life not less than 6 months at date of delivery." },
      { label: "Storage Condition", value: "Unopened: Store in a clean and dry place at ambient temperature.\n\nAfter opening: Tomato paste is typically usable for 5 to 7 days in the refrigerator. It also can be stored in the freezer for up to 6 months without affecting its taste or color." }
    ]
  },
  analysis: {
    title: "Analysis",
    tests: [
      { label: "Brix", value: "10-12" },
      { label: "PH", value: "3.9 - 4.5" },
      { label: "Total Acidity", value: "3% - 7%" },
      { label: "Salt", value: "< 1.5%" }
    ],
    organoleptic: [
      { label: "Color", value: "Red, Light Red" },
      { label: "Taste", value: "Sweet, Sour, Pure Natural Tomatoes Flavor, No Burnt & Fermented Taste" },
      { label: "Appearance", value: "Reasonably whole state. At least 70 percent of the drained weight is whole or almost whole." },
      { label: "Smell", value: "No Abnormal Odour, No Burnt & Fermented Smell" }
    ]
  }
};

const LIFECYCLE_STAGES = [
  {
    id: "seedling",
    name: "Seedling",
    day: "Day 1-20",
    description: "Young heirloom sprouts emerge from organic soil. They are carefully watered with natural rainwater and monitored daily.",
    brix: "1.2°Bx",
    acidity: "0.2%",
    lycopene: "5 mg/kg",
    svg: (
      <svg viewBox="0 0 100 100" className="stage-svg">
        <circle cx="50" cy="90" r="8" fill="#5c4033" />
        <path d="M50,90 Q48,70 50,55" stroke="var(--green-mid)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M50,65 Q35,55 38,48 C43,45 48,55 50,60" fill="var(--sage)" />
        <path d="M50,55 Q65,45 62,38 C57,35 52,45 50,50" fill="var(--sage)" />
      </svg>
    )
  },
  {
    id: "flowering",
    name: "Flowering",
    day: "Day 35-50",
    description: "Bright yellow blossoms appear, inviting local honeybees for pollination. This stage marks the foundation of the future tomato yield.",
    brix: "3.5°Bx",
    acidity: "0.4%",
    lycopene: "12 mg/kg",
    svg: (
      <svg viewBox="0 0 100 100" className="stage-svg">
        <circle cx="50" cy="90" r="8" fill="#5c4033" />
        <path d="M50,90 Q46,50 50,35" stroke="var(--green-mid)" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Flower Center */}
        <circle cx="50" cy="35" r="5" fill="var(--gold)" />
        {/* Petals */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M50,35 Q50,20 48,22 Q46,20 50,35"
            fill="#FFF75E"
            transform={`rotate(${deg} 50 35)`}
          />
        ))}
      </svg>
    )
  },
  {
    id: "green_vine",
    name: "Green Vine",
    day: "Day 60-80",
    description: "Young firm green fruit forms. The tomatoes draw mineral-rich water and sun energy to develop natural sugars and organic acids.",
    brix: "4.8°Bx",
    acidity: "0.9%",
    lycopene: "35 mg/kg",
    svg: (
      <svg viewBox="0 0 100 100" className="stage-svg">
        <path d="M30,30 Q50,25 70,30" stroke="var(--green-deep)" strokeWidth="3" fill="none" />
        <circle cx="50" cy="55" r="22" fill="#7ba356" />
        <ellipse cx="44" cy="48" rx="6" ry="3" fill="#fff" opacity="0.3" transform="rotate(-20 44 48)" />
        <path d="M50,33 L48,28 M50,33 L53,27" stroke="var(--green-deep)" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "sun_ripened",
    name: "Sun Ripened",
    day: "Day 90+",
    description: "Vibrant crimson tomatoes fully mature under direct sunlight. Sugars surge while acidity softens, giving the classic deep sweet tomato taste.",
    brix: "6.2°Bx",
    acidity: "0.55%",
    lycopene: "180 mg/kg",
    svg: (
      <svg viewBox="0 0 100 100" className="stage-svg">
        <path d="M30,30 Q50,25 70,30" stroke="var(--green-deep)" strokeWidth="3" fill="none" />
        <circle cx="50" cy="55" r="24" fill="var(--tomato)" />
        <ellipse cx="42" cy="46" rx="8" ry="4" fill="#fff" opacity="0.3" transform="rotate(-20 42 46)" />
        <path d="M50,31 L48,25 L50,31 L54,24" stroke="var(--green-deep)" strokeWidth="2.5" />
      </svg>
    )
  },
  {
    id: "pureed",
    name: "Pureed & Jarred",
    day: "Fresh Seal",
    description: "Slow-cooked at precisely 85°C to reduce excess water naturally. Hermetically sealed with fresh basil essence to capture flavor forever.",
    brix: "8.5°Bx",
    acidity: "0.50%",
    lycopene: "240 mg/kg",
    svg: (
      <svg viewBox="0 0 100 100" className="stage-svg">
        <rect x="35" y="15" width="30" height="8" rx="2" fill="var(--sage)" />
        <path d="M30,23 h40 a4,4 0 0 1 4,4 v55 a8,8 0 0 1 -8,8 h-32 a8,8 0 0 1 -8,-8 v-55 a4,4 0 0 1 4,-4 Z" fill="rgba(255,255,255,0.7)" stroke="var(--charcoal)" strokeWidth="2.5" />
        <rect x="30" y="32" width="40" height="38" fill="var(--tomato)" />
        <rect x="33" y="44" width="34" height="14" fill="var(--cream-2)" opacity="0.9" />
        <line x1="36" y1="51" x2="64" y2="51" stroke="var(--tomato)" strokeWidth="1.5" />
      </svg>
    )
  }
];

const RECIPES = [
  {
    id: "curry",
    name: "Royal Masala Gravy",
    product: "Tomato Purée",
    baseServing: 4,
    ingredients: [
      { name: "Indus Food Tomato Purée", amount: 200, unit: "ml" },
      { name: "Finely Chopped Red Onion", amount: 2, unit: "medium" },
      { name: "Ginger Garlic Paste", amount: 1.5, unit: "tbsp" },
      { name: "Garam Masala & Spices", amount: 2, unit: "tsp" },
      { name: "Heavy Cream / Cashew Paste", amount: 50, unit: "ml" },
      { name: "Butter or Cooking Oil", amount: 2, unit: "tbsp" }
    ],
    instructions: "Sauté onions and ginger-garlic paste until brown. Stir in dry spices, then pour in the Tomato Purée. Simmer on medium-low for 10 minutes until oil separates. Finish with cream."
  },
  {
    id: "pasta",
    name: "Classic Basil Marinara",
    product: "Tomato Paste",
    baseServing: 4,
    ingredients: [
      { name: "Indus Food Tomato Paste", amount: 3, unit: "tbsp" },
      { name: "Crushed Heirloom Tomatoes", amount: 400, unit: "g" },
      { name: "Extra Virgin Olive Oil", amount: 3, unit: "tbsp" },
      { name: "Fresh Garlic (Slivered)", amount: 4, unit: "cloves" },
      { name: "Fresh Basil Leaves", amount: 10, unit: "leaves" },
      { name: "Sea Salt & Red Pepper Flakes", amount: 1, unit: "pinch" }
    ],
    instructions: "Warm olive oil and cook garlic gently until golden. Whisk in the Tomato Paste to caramelize it for 2 minutes, then add crushed tomatoes. Simmer 15 mins, stir in fresh basil."
  },
  {
    id: "pizza",
    name: "Neapolitan Pizza Sauce",
    product: "Tomato Purée",
    baseServing: 3,
    ingredients: [
      { name: "Indus Food Tomato Purée", amount: 250, unit: "ml" },
      { name: "Dried Wild Oregano", amount: 1, unit: "tsp" },
      { name: "Extra Virgin Olive Oil", amount: 1, unit: "tbsp" },
      { name: "Finely Ground Sea Salt", amount: 0.5, unit: "tsp" }
    ],
    instructions: "Mix the tomato purée raw with sea salt, olive oil, and crushed wild oregano. Spread directly onto stretched sourdough crust before baking at high temperature."
  },
  {
    id: "dip",
    name: "Spicy Garlic Chili Glaze",
    product: "Garlic Chili Sauce",
    baseServing: 6,
    ingredients: [
      { name: "Indus Food Garlic Chili Sauce", amount: 150, unit: "ml" },
      { name: "Organic Honey or Maple Syrup", amount: 1.5, unit: "tbsp" },
      { name: "Soy Sauce (Low Sodium)", amount: 1, unit: "tbsp" },
      { name: "Fresh Cilantro (Chopped)", amount: 2, unit: "tbsp" }
    ],
    instructions: "Whisk garlic chili sauce, honey, and soy sauce in a small pan. Heat gently for 3 minutes until bubbling. Drizzle over roasted vegetables, crispy chicken, or tofu."
  }
];

const INITIAL_REVIEWS = [
  { id: 1, name: "Marcus V. (Procurement Director, Gusto Foods)", rating: 5, date: "2026-06-12", comment: "The Brix sweetness levels and consistency in these aseptic drum shipments are outstanding. It serves as the primary paste base for our entire retail tomato sauce line." },
  { id: 2, name: "Elena R. (Global Supply Coordinator)", rating: 5, date: "2026-07-02", comment: "We coordinate bulk distribution of over 500 tons monthly. The processing sanitation, chemical specifications, and EU standards are fully met in every batch." },
  { id: 3, name: "Daniel K. (Plant Operations Manager, Red Sauce Co.)", rating: 5, date: "2026-07-10", comment: "Sourcing bulk aseptic purée from Indus Food has stabilized our production. Excellent heat-stabilized color retention and shelf life without chemical preservatives." }
];

/* ---------- Sub-Components ---------- */

function Counter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });

  const numericString = value.replace(/[^0-9]/g, "");
  const suffix = value.replace(/[0-9]/g, "");
  const numericValue = parseInt(numericString, 10) || 0;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState("0" + suffix);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, numericValue, {
        duration: 2.0,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, numericValue, count]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      setDisplayValue(latest + suffix);
    });
  }, [rounded, suffix]);

  return <span ref={ref}>{displayValue}</span>;
}

function TomatoIcon({ size = 20, fill = "none", stroke = "currentColor" }) {
  const isFilled = fill !== "none";
  const bodyColor = isFilled ? "var(--tomato)" : "none";
  const strokeColor = isFilled ? "var(--tomato)" : stroke;
  const leafColor = isFilled ? "var(--green-mid)" : stroke;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ overflow: "visible", display: "inline-block", verticalAlign: "middle" }}
    >
      <path
        d="M12 20C7.58172 20 4 16.866 4 13C4 9.13401 7.58172 6 12 6C16.4183 6 20 9.13401 20 13C20 16.866 16.4183 20 12 20Z"
        fill={bodyColor}
        stroke={strokeColor}
        strokeWidth="2"
      />
      {isFilled && (
        <path
          d="M8 10C8 8.89543 9.79086 8 12 8"
          stroke="#FFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      )}
      <path
        d="M12 6C12 4.5 13 3 15 3 M12 6C11 5 9 4.5 7 5 M12 6C12 5 11 3.5 10 3"
        stroke={leafColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NaturalOrganicLeaf({ scale = 1, flip = false }) {
  return (
    <g transform={`scale(${scale * (flip ? -1 : 1)}, ${scale})`}>
      {/* Soft Drop Shadow */}
      <path
        d="M0,0 Q18,-18 36,-4 Q18,16 0,0 Z"
        fill="rgba(0,0,0,0.18)"
        transform="translate(2, 3)"
      />
      {/* Photorealistic Leaf Body */}
      <path
        d="M0,0 Q18,-18 36,-4 Q18,16 0,0 Z"
        fill="url(#real-leaf-grad)"
        stroke="#18361b"
        strokeWidth="0.8"
      />
      {/* Midrib & Veins */}
      <path
        d="M0,0 Q18,-4 32,-4"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M8,-4 Q13,-9 16,-11 M16,-4 Q21,-8 24,-10 M12,0 Q16,4 19,6"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Dewdrop specularity */}
      <circle cx="22" cy="-4" r="2" fill="#FFFFFF" opacity="0.7" />
    </g>
  );
}

function ScrollTomatoProcessBuilder() {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 });

  // 10 Continuous Vine Nodes growing leaves from top (0%) to bottom, with tomatoes at the end (60%-100%)
  const vineNodes = [
    { progress: 0.05, side: "right", type: "leaf", scale: 0.75 },
    { progress: 0.14, side: "left", type: "leaf", scale: 0.85 },
    { progress: 0.24, side: "right", type: "leaf", scale: 0.9 },
    { progress: 0.35, side: "left", type: "leaf", scale: 0.95 },
    { progress: 0.46, side: "right", type: "blossom", scale: 1.0 },
    { progress: 0.58, side: "left", type: "green_tomato", scale: 1.0 },
    { progress: 0.68, side: "right", type: "ripe_tomato", scale: 1.1 },
    { progress: 0.78, side: "left", type: "ripe_tomato", scale: 1.15 },
    { progress: 0.88, side: "right", type: "ripe_tomato", scale: 1.2 },
    { progress: 0.95, side: "left", type: "ripe_tomato", scale: 1.25 }
  ];

  return (
    <div
      className="scroll-vine-fixed"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: "1.2vw",
        width: "60px",
        pointerEvents: "none",
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <svg
        viewBox="0 0 60 1000"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="real-leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3E7536" />
            <stop offset="50%" stopColor="#255220" />
            <stop offset="100%" stopColor="#143011" />
          </linearGradient>
          <linearGradient id="real-stem-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B6248" />
            <stop offset="50%" stopColor="#528360" />
            <stop offset="85%" stopColor="#C4432A" />
            <stop offset="100%" stopColor="#8C2112" />
          </linearGradient>
        </defs>

        {/* Dynamic Growing Process Stem Path */}
        <motion.path
          d="M 30,0 C 45,150 15,300 30,450 C 45,600 15,750 30,900 C 42,950 22,980 30,1000"
          fill="none"
          stroke="url(#real-stem-grad)"
          strokeWidth="3.6"
          strokeLinecap="round"
          style={{ pathLength }}
        />

        {/* Sequential Tomato Process Stage Nodes */}
        {vineNodes.map((node, i) => (
          <motion.g
            key={i}
            transform={`translate(30, ${node.progress * 1000})`}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-5%" }}
            transition={{ type: "spring", stiffness: 130, damping: 14, delay: 0.05 }}
          >
            {/* Connecting Stem Node Ring */}
            <circle cx="0" cy="0" r="4" fill="var(--green-mid)" stroke="var(--gold)" strokeWidth="1" />

            {/* Left/Right Sprouting Leaves */}
            <motion.g
              transform="rotate(-40) translate(-8, -4)"
              animate={{ rotate: [-43, -37, -43] }}
              transition={{ repeat: Infinity, duration: 4 + i * 0.3, ease: "easeInOut" }}
            >
              <NaturalOrganicLeaf scale={node.scale * 0.7} flip={true} />
            </motion.g>
            <motion.g
              transform="rotate(35) translate(8, -4)"
              animate={{ rotate: [33, 37, 33] }}
              transition={{ repeat: Infinity, duration: 3.5 + i * 0.3, ease: "easeInOut" }}
            >
              <NaturalOrganicLeaf scale={node.scale * 0.75} flip={false} />
            </motion.g>

            {/* Blossom Flower at Mid-Growth */}
            {node.type === "blossom" && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.6 }}
              >
                <text x="0" y="4" textAnchor="middle" fontSize="14">🌼</text>
              </motion.g>
            )}

            {/* Unripe Green Tomato */}
            {node.type === "green_tomato" && (
              <motion.g
                transform="translate(0, 10)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                <Tomato cx={0} cy={0} r={7} fill="#69943B" />
              </motion.g>
            )}

            {/* Ripe Crimson Tomatoes growing at lower sections (60%-100%) */}
            {node.type === "ripe_tomato" && (
              <motion.g
                transform={node.side === "right" ? "translate(12, 6)" : "translate(-12, 6)"}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 12 }}
              >
                {/* Stem Attachment */}
                <line x1={node.side === "right" ? -12 : 12} y1="-6" x2="0" y2="0" stroke="#3E7536" strokeWidth="1.5" />
                <Tomato cx={0} cy={0} r={10 * node.scale} fill="var(--tomato)" />
              </motion.g>
            )}
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

function ScrollLeafCluster({ x, y, rotation, progressVal, triggerAt = 0.2 }) {
  const scale = useTransform(progressVal, [triggerAt - 0.12, triggerAt + 0.08], [0, 1]);
  const opacity = useTransform(progressVal, [triggerAt - 0.12, triggerAt], [0, 1]);
  const leafRotate = useTransform(progressVal, [triggerAt - 0.12, triggerAt + 0.12], [rotation - 30, rotation]);

  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      style={{ scale, opacity, rotate: leafRotate }}
    >
      {/* Primary Leaf */}
      <NaturalOrganicLeaf scale={0.85} flip={rotation < 0} />
      {/* Secondary Companion Leaf */}
      <g transform="translate(8, 4) rotate(32) scale(0.65)">
        <NaturalOrganicLeaf scale={0.7} flip={rotation >= 0} />
      </g>
    </motion.g>
  );
}

function VineDivider() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.92", "end 0.45"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  const leaves = [
    { x: 120, y: 14, rot: -28, trigger: 0.12 },
    { x: 280, y: 26, rot: 32, trigger: 0.26 },
    { x: 440, y: 12, rot: -22, trigger: 0.42 },
    { x: 600, y: 28, rot: 35, trigger: 0.58 },
    { x: 760, y: 10, rot: -30, trigger: 0.72 },
    { x: 920, y: 26, rot: 28, trigger: 0.86 },
    { x: 1080, y: 14, rot: -25, trigger: 0.95 }
  ];

  return (
    <div ref={containerRef} className="vine-wrap" aria-hidden="true" style={{ padding: "20px 0", overflow: "visible" }}>
      <svg viewBox="0 0 1200 42" preserveAspectRatio="none" className="vine-svg" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="divider-stem-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2E5434" />
            <stop offset="50%" stopColor="#4A8050" />
            <stop offset="100%" stopColor="#1E3821" />
          </linearGradient>
        </defs>

        {/* Dynamic Growing Organic Vine Stem on Scroll */}
        <motion.path
          d="M 0,20 C 150,5 300,35 450,20 C 600,5 750,35 900,20 C 1000,8 1100,32 1200,20"
          fill="none"
          stroke="url(#divider-stem-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          style={{ pathLength }}
        />

        {/* Dynamic Leaves Building Up Sequentially on Scroll into Next Section */}
        {leaves.map((leaf, idx) => (
          <ScrollLeafCluster
            key={idx}
            x={leaf.x}
            y={leaf.y}
            rotation={leaf.rot}
            progressVal={scrollYProgress}
            triggerAt={leaf.trigger}
          />
        ))}
      </svg>
    </div>
  );
}

function Tomato({ cx, cy, r, fill, highlight = "#fff" }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <ellipse
        cx={cx - r * 0.35}
        cy={cy - r * 0.35}
        rx={r * 0.28}
        ry={r * 0.18}
        fill={highlight}
        opacity="0.25"
      />
      <path
        d={`M${cx},${cy - r - 2} l -5,-8 l 5,3 l 0,-9 l 5,9 l 5,-3 l -5,8 Z`}
        fill="var(--green-mid)"
      />
    </g>
  );
}

function HeroIllustration({ mouseX, mouseY }) {
  const x = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1200], [-15, 15]);
  const y = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [-15, 15]);
  const rx = useTransform(mouseX, [0, 1200], [5, -5]);

  return (
    <motion.svg
      viewBox="0 0 420 420"
      className="hero-illustration"
      role="img"
      aria-label="Cluster of vine tomatoes"
      style={{ x, y, rotate: rx }}
    >
      <path
        d="M60,70 C120,40 180,120 210,90 C250,50 320,60 360,110"
        fill="none"
        stroke="var(--green-mid)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M110,60 q18,-22 34,-4 q-20,4 -34,4Z" fill="var(--green-mid)" />
      <path d="M300,80 q18,-20 32,0 q-18,6 -32,0Z" fill="var(--green-mid)" />
      <Tomato cx={140} cy={160} r={72} fill="#E3A23D" />
      <Tomato cx={255} cy={140} r={80} fill="#D24A2E" />
      <Tomato cx={330} cy={215} r={70} fill="var(--tomato)" />
      <Tomato cx={165} cy={270} r={78} fill="#CF4A2C" />
      <Tomato cx={270} cy={280} r={66} fill="#B93A22" />
    </motion.svg>
  );
}

function JarIllustration({ tone }) {
  const tones = {
    tomato: "var(--tomato)",
    gold: "var(--gold)",
    deep: "var(--green-mid)",
  };
  const fill = tones[tone] || tones.tomato;
  return (
    <svg viewBox="0 0 120 140" className="jar-illustration" role="img" aria-hidden="true">
      <rect x="30" y="14" width="60" height="16" rx="4" fill="var(--sage)" />
      <path d="M25,30 h70 a6,6 0 0 1 6,6 v78 a10,10 0 0 1 -10,10 h-62 a10,10 0 0 1 -10,-10 v-78 a6,6 0 0 1 6,-6 Z" fill="var(--cream-2)" stroke="var(--charcoal)" strokeOpacity="0.08" strokeWidth="2" />
      <path d="M25,60 h70 v50 a10,10 0 0 1 -10,10 h-50 a10,10 0 0 1 -10,-10 Z" fill={fill} />
      <rect x="18" y="88" width="84" height="20" fill="var(--cream-2)" opacity="0.92" />
      <line x1="18" y1="94" x2="102" y2="94" stroke={fill} strokeWidth="2" opacity="0.5" />
      <line x1="18" y1="102" x2="102" y2="102" stroke={fill} strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

/* ---------- Main App Component ---------- */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Custom theme control
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  // Mouse coords for custom cursor & parallax
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [hasMouse, setHasMouse] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Scroll Progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Widget States
  const [inspectProduct, setInspectProduct] = useState(null);
  const [activeStage, setActiveStage] = useState(LIFECYCLE_STAGES[3]); // Default to "Sun Ripened"
  const [activeTechTab, setActiveTechTab] = useState("summary");
  const [selectedRecipe, setSelectedRecipe] = useState(RECIPES[0]);
  const [recipeServings, setRecipeServings] = useState(4);
  const [tanginessBoost, setTanginessBoost] = useState(0);
  const [spiceLevel, setSpiceLevel] = useState("Medium");

  // Wholesale calculator states
  const [pureeDrums, setPureeDrums] = useState(10);
  const [pasteDrums, setPasteDrums] = useState(5);
  const [flexitanks, setFlexitanks] = useState(1);
  const [shippingTier, setShippingTier] = useState("ocean_fcl");

  // Reviews States
  const [reviews, setReviews] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tomato_reviews");
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    }
    return INITIAL_REVIEWS;
  });
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewFilter, setReviewFilter] = useState("all");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if user has pointer hover capability
    const media = window.matchMedia("(pointer: fine)");
    setHasMouse(media.matches);

    const handleMouseMove = (e) => {
      setMouseCoords({ x: e.clientX, y: e.clientY });
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    if (media.matches) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Persist reviews
  useEffect(() => {
    localStorage.setItem("tomato_reviews", JSON.stringify(reviews));
  }, [reviews]);

  // Wholesale Estimates
  const pureeDrumCost = 480; // $480 per 240kg Aseptic Drum
  const pasteDrumCost = 580; // $580 per 240kg Aseptic Drum
  const flexitankCost = 12500; // $12,500 per 20 metric ton Flexitank

  const totalDrums = pureeDrums + pasteDrums;
  const rawSubtotal = (pureeDrums * pureeDrumCost) + (pasteDrums * pasteDrumCost) + (flexitanks * flexitankCost);

  // Total tonnage (Metric Tons)
  const totalTonnage = (totalDrums * 0.24) + (flexitanks * 20);

  // Dynamic Discount Tier
  let discountPercent = 0;
  let tierLabel = "Standard Industrial Tier";
  if (totalTonnage >= 40) {
    discountPercent = 15;
    tierLabel = "Enterprise Contract (15% Off)";
  } else if (totalTonnage >= 10) {
    discountPercent = 10;
    tierLabel = "FCL Volume Discount (10% Off)";
  } else if (totalTonnage >= 2) {
    discountPercent = 5;
    tierLabel = "LCL Volume Discount (5% Off)";
  }

  const discountAmount = rawSubtotal * (discountPercent / 100);
  const discountedSubtotal = rawSubtotal - discountAmount;

  // Shipping calculations
  const shippingCosts = { ocean_lcl: 450, ocean_fcl: 1800, air_cargo: 6500 };
  const baseShipping = (totalDrums > 0 || flexitanks > 0) ? shippingCosts[shippingTier] : 0;
  const finalTotal = discountedSubtotal + baseShipping;

  const totalWeight = Math.round(totalTonnage * 2204.62); // lbs

  // Bulk Tomato calculation
  const estimatedTomatoes = Math.round((totalDrums * 5280) + (flexitanks * 440000));

  // Review submission
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const added = {
      id: Date.now(),
      name: newReviewName,
      rating: newReviewRating,
      date: new Date().toISOString().split("T")[0],
      comment: newReviewComment
    };

    setReviews([added, ...reviews]);
    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewRating(5);
  };

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "all") return true;
    return r.rating === parseInt(reviewFilter, 10);
  });

  return (
    <div className="indus-app">
      {/* Scroll Progress Bar */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      {/* Custom Mouse Trail Effect (Desktop only) */}
      {hasMouse && (
        <>
          <div
            className="custom-cursor"
            style={{ left: `${mouseCoords.x}px`, top: `${mouseCoords.y}px` }}
          />
          <div
            className="custom-cursor-dot"
            style={{ left: `${mouseCoords.x}px`, top: `${mouseCoords.y}px` }}
          />
        </>
      )}

      <style>{`
        /* Advanced Web Design Core Utility additions */
        .scroll-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4.5px;
          background: linear-gradient(to right, var(--gold), var(--tomato));
          transform-origin: 0%;
          z-index: 10001;
        }

        /* 3D Viewports & Canvas Styles */
        .three-hero-container {
          width: 100%;
          height: 480px;
          max-width: 520px;
          justify-self: center;
          position: relative;
          cursor: grab;
        }
        .three-hero-container:active { cursor: grabbing; }

        .product-3d-viewport {
          width: 100%;
          height: 180px;
          cursor: pointer;
          position: relative;
        }

        .lifecycle-3d-viewport {
          width: 100%;
          height: 220px;
          position: relative;
        }

        .wholesale-3d-viewport {
          width: 100%;
          height: 240px;
          border-radius: 16px;
          background: rgba(0,0,0,0.15);
          margin-top: 15px;
        }

        /* 3D Inspect Modal */
        .inspect-3d-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .inspect-3d-modal {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          width: 100%;
          max-width: 650px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .inspect-header {
          padding: 24px 28px 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-color);
        }
        .inspect-badge {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--tomato);
          background: rgba(196, 67, 42, 0.12);
          padding: 4px 10px;
          border-radius: 99px;
          display: inline-block;
          margin-bottom: 6px;
        }
        .inspect-header h2 {
          font-size: 24px;
          font-family: 'Fraunces', serif;
          color: var(--text-primary);
          margin: 0;
        }
        .inspect-close-btn {
          background: rgba(0, 0, 0, 0.05);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-primary);
          transition: background 0.2s;
        }
        .inspect-close-btn:hover {
          background: rgba(196, 67, 42, 0.15);
          color: var(--tomato);
        }
        .inspect-canvas-wrap {
          width: 100%;
          height: 340px;
          position: relative;
          background: radial-gradient(circle at center, rgba(196,67,42,0.06) 0%, transparent 70%);
          cursor: grab;
        }
        .inspect-canvas-wrap:active { cursor: grabbing; }
        .inspect-hint {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12.5px;
          color: var(--text-secondary);
          background: var(--card-bg);
          padding: 6px 16px;
          border-radius: 99px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
        }
        .spin-icon {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .inspect-toolbar {
          padding: 16px 28px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          border-top: 1px solid var(--border-color);
          flex-wrap: wrap;
        }
        .toolbar-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .toolbar-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .toolbar-btn {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid var(--border-color);
          border-radius: 99px;
          padding: 6px 14px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .toolbar-btn:hover {
          background: rgba(196, 67, 42, 0.1);
          border-color: var(--tomato);
          color: var(--tomato);
        }
        .toolbar-btn.active {
          background: var(--tomato);
          border-color: var(--tomato);
          color: #ffffff;
        }
        .btn-3d-inspect {
          margin-top: 10px;
          width: 100%;
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid var(--tomato);
          background: rgba(196,67,42,0.08);
          color: var(--tomato);
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s;
        }
        .btn-3d-inspect:hover {
          background: var(--tomato);
          color: #FFF;
          transform: translateY(-2px);
        }
        .featured .btn-3d-inspect {
          border-color: var(--gold);
          background: rgba(227,162,61,0.2);
          color: var(--gold);
        }
        .featured .btn-3d-inspect:hover {
          background: var(--gold);
          color: var(--green-deep);
        }

        .indus-app {
          font-family: 'Work Sans', sans-serif;
          color: var(--text-primary);
          background: var(--bg-gradient);
          overflow-x: hidden;
          transition: background 0.4s ease;
        }
        .indus-app * { box-sizing: border-box; }
        
        .indus-app h1, .indus-app h2, .indus-app h3, .indus-app .display {
          font-family: 'Fraunces', serif;
          margin: 0;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }

        .eyebrow {
          font-family: 'Work Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--tomato);
        }
        .eyebrow.on-dark { color: var(--gold); }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Work Sans', sans-serif;
          font-weight: 600;
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 999px;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          text-decoration: none;
        }
        .btn:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 12px 20px -8px rgba(0,0,0,0.25);
        }
        .btn:active {
          transform: translateY(-1px);
        }
        .btn-primary { background: var(--tomato); color: #FFF; }
        .btn-primary:hover { 
          background: var(--tomato-dark); 
          box-shadow: 0 10px 24px -6px rgba(196,67,42,0.45); 
        }
        .btn-outline { border-color: rgba(247,241,230,0.4); color: #FFF; background: transparent; }
        .btn-outline:hover { background: rgba(255,255,255,0.1); }
        .btn-outline-dark { border-color: var(--border-color); color: var(--text-primary); background: transparent; }
        .btn-outline-dark:hover { background: var(--border-color); }

        /* Advanced Floating Glass 3D Navbar Styling */
        .nav-wrapper {
          position: fixed;
          top: 18px;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          padding: 0 20px;
          pointer-events: none;
        }
        .nav {
          pointer-events: auto;
          width: 100%;
          max-width: 1240px;
          height: 64px;
          padding: 0 20px 0 24px;
          border-radius: 999px;
          background: rgba(255, 253, 248, 0.78);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(30, 58, 41, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-theme="dark"] .nav {
          background: rgba(18, 28, 22, 0.84);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.45);
        }
        .nav.scrolled {
          height: 56px;
          max-width: 1140px;
          background: rgba(255, 253, 248, 0.92);
          box-shadow: 0 20px 48px -10px rgba(0, 0, 0, 0.18);
        }
        [data-theme="dark"] .nav.scrolled {
          background: rgba(18, 28, 22, 0.95);
        }
        .nav-logo {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--green-deep);
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        [data-theme="dark"] .nav-logo { color: var(--gold); }
        .logo-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(196, 67, 42, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--tomato);
          transition: transform 0.3s ease;
        }
        .nav-logo:hover .logo-icon-badge {
          transform: rotate(15deg) scale(1.1);
        }
        
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .nav-link-item {
          position: relative;
          padding: 8px 14px;
          border-radius: 999px;
          color: var(--text-primary);
          font-size: 13.5px;
          font-weight: 500;
          white-space: nowrap;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .nav-link-item:hover {
          color: var(--tomato);
          background: rgba(196, 67, 42, 0.08);
        }
        
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 999px;
          background: var(--green-deep);
          color: #FFF;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(30, 58, 41, 0.25);
          transition: all 0.3s ease;
        }
        [data-theme="dark"] .btn-nav-cta {
          background: var(--tomato);
          box-shadow: 0 4px 16px rgba(196, 67, 42, 0.35);
        }
        .btn-nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(30, 58, 41, 0.35);
        }

        /* Floating controls: Dark mode & navigation trigger */
        .theme-toggle-btn {
          background: rgba(0, 0, 0, 0.04);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
        }
        .theme-toggle-btn:hover {
          transform: scale(1.1) rotate(15deg);
          background: var(--tomato);
          color: #FFF;
          border-color: var(--tomato);
        }

        .nav-toggle { display: none; background: none; border: none; cursor: pointer; color: var(--text-primary); }
        .mobile-menu { display: none; }

        /* Hero styling */
        .hero {
          background: radial-gradient(circle at 80% 20%, var(--green-mid) 0%, var(--green-deep) 100%);
          color: #FFF;
          padding: 80px 6vw 110px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 50px;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          background: var(--tomato);
          filter: blur(140px);
          opacity: var(--glow-opacity);
          top: -50px;
          left: -50px;
          pointer-events: none;
        }
        .hero-text { position: relative; z-index: 2; }
        .hero h1 { font-size: clamp(40px, 5.5vw, 68px); line-height: 1.05; margin: 16px 0 24px; color: #FFF; }
        .hero h1 em { color: var(--gold); font-style: italic; }
        .hero p { font-size: 17.5px; line-height: 1.75; color: rgba(255, 255, 255, 0.82); max-width: 520px; margin-bottom: 34px; }
        .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
        .trust-strip { display: flex; gap: 32px; flex-wrap: wrap; }
        .trust-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.78); }
        .hero-illustration { width: 100%; max-width: 480px; justify-self: center; filter: drop-shadow(0 28px 50px rgba(0,0,0,0.35)); }

        .vine-wrap { display: flex; justify-content: center; background: transparent; }
        .vine-svg { width: 100%; max-width: 1200px; height: 50px; }

        section { padding: 100px 6vw; position: relative; }
        .section-head { max-width: 680px; margin: 0 auto 60px; text-align: center; }
        .section-head h2 { font-size: clamp(32px, 3.8vw, 46px); margin-top: 14px; }
        .section-head p { color: var(--text-secondary); margin-top: 16px; font-size: 16.5px; line-height: 1.75; }

        /* Story Section */
        .story { display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
        .story-copy h2 { font-size: clamp(30px, 3.5vw, 42px); margin-bottom: 20px; }
        .story-copy p { line-height: 1.85; color: var(--text-secondary); margin-bottom: 20px; font-size: 16px; }
        .story-art { 
          background: var(--card-bg); 
          border-radius: 24px; 
          padding: 40px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border: 1px solid var(--border-color);
          box-shadow: 0 10px 40px -15px rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
        }
        
        /* Interactive growth widget styling */
        .lifecycle-container {
          background: var(--card-bg);
          border-radius: 24px;
          padding: 40px;
          border: 1px solid var(--border-color);
          box-shadow: 0 15px 45px -15px rgba(0,0,0,0.08);
          margin-top: 40px;
        }
        .lifecycle-tabs {
          display: flex;
          justify-content: space-between;
          border-bottom: 1.5px solid var(--border-color);
          margin-bottom: 30px;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .lifecycle-tab {
          background: none;
          border: none;
          padding: 12px 18px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          white-space: nowrap;
          transition: color 0.3s;
        }
        .lifecycle-tab.active {
          color: var(--tomato);
        }
        .lifecycle-tab-bar {
          position: absolute;
          bottom: -10px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--tomato);
          border-radius: 2px;
        }
        .lifecycle-content {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 40px;
          align-items: center;
        }
        .stage-visual {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 20px;
          padding: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 250px;
          border: 1px dashed var(--border-color);
        }
        .stage-svg {
          height: 100%;
          max-height: 200px;
        }
        .stage-details h3 {
          font-size: 26px;
          margin-bottom: 6px;
        }
        .stage-day {
          display: inline-block;
          font-size: 13px;
          font-weight: 600;
          background: rgba(196,67,42,0.12);
          color: var(--tomato);
          padding: 4px 12px;
          border-radius: 99px;
          margin-bottom: 16px;
        }
        .stage-description {
          font-size: 15.5px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }
        .stage-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          background: rgba(0,0,0,0.02);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }
        .metric-card {
          text-align: center;
        }
        .metric-title {
          font-size: 12px;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-bottom: 4px;
          letter-spacing: 0.05em;
        }
        .metric-val {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--tomato);
        }

        /* Products Grid */
        .products { background: rgba(0,0,0,0.01); }
        .product-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 30px; }
        .product-card {
          background: var(--card-bg); border-radius: 22px; padding: 34px;
          display: flex; flex-direction: column; gap: 20px;
          border: 1px solid var(--border-color);
          box-shadow: 0 10px 30px -15px rgba(0,0,0,0.05);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .product-card.featured { grid-row: span 2; background: radial-gradient(circle at 10% 10%, var(--green-mid) 0%, var(--green-deep) 100%); color: #FFF; }
        .product-card.featured h3 { color: #FFF; }
        .product-card.featured p { color: rgba(255, 255, 255, 0.8); }
        .product-card h3 { font-size: 24px; }
        .product-card p { font-size: 15px; line-height: 1.75; color: var(--text-secondary); flex-grow: 1; }
        .jar-illustration { width: 90px; height: 110px; transition: transform 0.3s; }
        .product-card.featured .jar-illustration { width: 130px; height: 150px; }
        .product-tag { display: inline-flex; align-self: flex-start; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 14px; border-radius: 999px; background: rgba(196,67,42,0.1); color: var(--tomato); }
        .featured .product-tag { background: rgba(227,162,61,0.22); color: var(--gold); }

        /* Recipe Scaler Widget styles */
        .recipe-scaler-widget {
          margin-top: 60px;
          background: var(--card-bg);
          border-radius: 24px;
          border: 1px solid var(--border-color);
          padding: 40px;
          box-shadow: 0 15px 45px -15px rgba(0,0,0,0.08);
        }
        .scaler-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .scaler-controls {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .control-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          justify-content: space-between;
        }
        .control-value {
          color: var(--tomato);
        }
        .recipe-select-btns {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .recipe-tab-btn {
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          background: rgba(0,0,0,0.02);
          cursor: pointer;
          font-family: inherit;
          font-size: 14.5px;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.25s;
          text-align: left;
        }
        .recipe-tab-btn.active {
          border-color: var(--tomato);
          background: rgba(196,67,42,0.08);
          color: var(--tomato);
        }
        .slider-input {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--border-color);
          outline: none;
        }
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--tomato);
          cursor: pointer;
          transition: transform 0.1s;
        }
        .slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .recipe-sheet {
          background: rgba(0,0,0,0.01);
          border: 1.5px dashed var(--border-color);
          border-radius: 16px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .recipe-sheet-header {
          border-bottom: 1.5px solid var(--border-color);
          padding-bottom: 14px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .ingredient-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ingredient-item {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(0,0,0,0.03);
        }
        .recipe-instructions {
          font-size: 14.5px;
          line-height: 1.65;
          color: var(--text-secondary);
          background: rgba(196,67,42,0.04);
          padding: 16px;
          border-radius: 8px;
          border-left: 3px solid var(--tomato);
        }

        /* Process Steps */
        .process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
        .step { text-align: left; }
        .step .n { font-family: 'Fraunces', serif; font-size: 44px; color: var(--sage); display: block; margin-bottom: 10px; }
        .step h3 { font-size: 20px; margin-bottom: 10px; }
        .step p { font-size: 15px; line-height: 1.7; color: var(--text-secondary); }

        /* Wholesale Estimator styles */
        .wholesale-section {
          background: radial-gradient(circle at 10% 90%, var(--green-mid) 0%, var(--green-deep) 100%);
          color: #FFF;
        }
        .wholesale-section h2 { color: #FFF; }
        .wholesale-section p { color: rgba(255,255,255,0.75); }
        .wholesale-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 40px;
        }
        .estimator-sliders {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }
        .invoice-sheet {
          background: #FFFFFF;
          color: var(--charcoal);
          border: 1px solid rgba(42, 35, 28, 0.12);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
          display: flex;
          flex-direction: column;
          gap: 20px;
          font-size: 14.5px;
          position: relative;
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        [data-theme="dark"] .invoice-sheet {
          background: #18281E;
          color: #F5EFEB;
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
        }
        .invoice-title {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          border-bottom: 2px solid var(--charcoal);
          padding-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-primary);
        }
        [data-theme="dark"] .invoice-title {
          border-bottom-color: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }
        .invoice-row {
          display: flex;
          justify-content: space-between;
          color: var(--text-primary);
        }
        .invoice-row span {
          color: var(--text-secondary);
        }
        [data-theme="dark"] .invoice-row span {
          color: rgba(245, 239, 235, 0.82);
        }
        .invoice-row strong {
          color: var(--text-primary);
        }
        [data-theme="dark"] .invoice-row strong {
          color: #FFFFFF;
        }
        .invoice-row.discount-row {
          color: var(--tomato) !important;
        }
        [data-theme="dark"] .invoice-row.discount-row,
        [data-theme="dark"] .invoice-row.discount-row span,
        [data-theme="dark"] .invoice-row.discount-row strong {
          color: #FF7B63 !important;
        }
        .invoice-divider {
          border-top: 1px dashed rgba(42, 35, 28, 0.15);
          margin: 6px 0;
        }
        [data-theme="dark"] .invoice-divider {
          border-top-color: rgba(255, 255, 255, 0.15);
        }
        .invoice-total {
          font-size: 20px;
          font-weight: 700;
          border-top: 2px solid var(--charcoal);
          padding-top: 14px;
          display: flex;
          justify-content: space-between;
          color: var(--text-primary);
        }
        [data-theme="dark"] .invoice-total {
          border-top-color: rgba(255, 255, 255, 0.2);
          color: var(--gold);
        }
        .tomato-count-badge {
          background: rgba(196, 67, 42, 0.08);
          border: 1px solid rgba(196, 67, 42, 0.25);
          color: #9C341F;
          border-radius: 12px;
          padding: 14px;
          font-size: 13.5px;
          text-align: center;
          font-weight: 600;
          line-height: 1.5;
        }
        [data-theme="dark"] .tomato-count-badge {
          background: rgba(215, 78, 53, 0.18);
          border-color: rgba(215, 78, 53, 0.45);
          color: #FFA590;
        }

        /* Stats Strip */
        .stats { background: var(--green-deep); color: #FFF; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; text-align: center; }
        .stat .value { font-family: 'Fraunces', serif; font-size: clamp(34px, 4.5vw, 52px); color: var(--gold); }
        .stat .label { font-size: 14px; margin-top: 8px; color: rgba(255,255,255,0.75); }

        /* Reviews System Styles */
        .reviews-container {
          background: var(--card-bg);
          border-radius: 24px;
          border: 1px solid var(--border-color);
          padding: 40px;
          box-shadow: 0 15px 45px -15px rgba(0,0,0,0.08);
          margin-top: 40px;
        }
        .reviews-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }
        .reviews-list-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .review-filters-bar {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .filter-btn {
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-primary);
          padding: 6px 14px;
          border-radius: 99px;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: var(--tomato);
          color: #FFF;
          border-color: var(--tomato);
        }
        .review-card {
          background: rgba(0,0,0,0.02);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .reviewer-name {
          font-weight: 600;
          font-size: 16px;
        }
        .review-date {
          font-size: 13px;
          color: var(--text-secondary);
        }
        .stars-container {
          display: flex;
          gap: 2px;
          color: var(--gold);
        }
        .review-comment {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        .add-review-form {
          background: rgba(0,0,0,0.01);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: fit-content;
        }
        .form-input, .form-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--card-bg);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 14.5px;
        }
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        .stars-selector {
          display: flex;
          gap: 8px;
        }
        .star-select-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--border-color);
          padding: 0;
          transition: transform 0.1s;
        }
        .star-select-btn.active {
          color: var(--gold);
        }
        .star-select-btn:hover {
          transform: scale(1.15);
        }

        /* Testimonials & Footer */
        .testimonial { text-align: center; background: rgba(0,0,0,0.01); }
        .testimonial-inner { max-width: 750px; margin: 0 auto; }
        .testimonial blockquote { font-family: 'Fraunces', serif; font-size: clamp(24px, 3vw, 32px); font-style: italic; line-height: 1.55; margin: 24px 0 28px; color: var(--green-deep); }
        [data-theme="dark"] .testimonial blockquote { color: var(--gold); }
        .testimonial cite { font-style: normal; font-size: 14.5px; color: var(--text-secondary); font-weight: 500; }

        .cta { background: var(--tomato); color: #FFF; text-align: center; }
        .cta h2 { font-size: clamp(30px, 3.8vw, 44px); margin-bottom: 18px; color: #FFF; }
        .cta p { color: rgba(255, 255, 255, 0.88); max-width: 520px; margin: 0 auto 34px; font-size: 16.5px; }

        footer { background: var(--green-deep); color: rgba(255,255,255,0.7); padding: 60px 6vw 40px; border-top: 1px solid var(--border-color); }
        .footer-top { display: flex; justify-content: space-between; gap: 40px; flex-wrap: wrap; padding-bottom: 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 30px; }
        .footer-logo { font-family: 'Fraunces', serif; color: #FFF; font-size: 24px; margin-bottom: 12px; }
        .footer-cols { display: flex; gap: 70px; flex-wrap: wrap; }
        .footer-col h4 { font-size: 13.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; font-weight: 600; }
        .footer-col a { display: block; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 15px; margin-bottom: 10px; transition: color 0.2s; }
        .footer-col a:hover { color: #FFF; }
        .footer-bottom { display: flex; justify-content: space-between; font-size: 13.5px; flex-wrap: wrap; gap: 12px; }

        /* Responsive Layouts */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; text-align: center; padding-top: 50px; }
          .hero-text { display: flex; flex-direction: column; align-items: center; }
          .hero-illustration { max-width: 360px; }
          .hero-ctas { justify-content: center; }
          .trust-strip { justify-content: center; }
          .story { grid-template-columns: 1fr; gap: 40px; }
          .story-art { order: -1; }
          .lifecycle-content { grid-template-columns: 1fr; }
          .scaler-layout { grid-template-columns: 1fr; }
          .wholesale-container { grid-template-columns: 1fr; }
          .reviews-layout { grid-template-columns: 1fr; }
          .product-grid { grid-template-columns: 1fr 1fr; }
          .product-card.featured { grid-column: span 2; grid-row: auto; }
        }

        @media (max-width: 768px) {
          .process-grid { grid-template-columns: 1fr 1fr; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .nav-links { display: none; }
          .nav-toggle { display: block; }
          .mobile-menu.open {
            display: flex; flex-direction: column; gap: 20px;
            position: fixed; inset: 0; top: 68px; background: var(--card-bg);
            padding: 40px 6vw; z-index: 98;
            border-bottom: 1px solid var(--border-color);
          }
          .mobile-menu a { font-size: 19px; color: var(--text-primary); text-decoration: none; font-weight: 600; }
        }

        @media (max-width: 500px) {
          .product-grid, .process-grid, .stats-grid { grid-template-columns: 1fr; }
          .product-card.featured { grid-column: auto; }
          .footer-cols { gap: 40px; }
        }

        /* Product Technical Information Widget */
        .tech-section {
          padding: 100px 6vw;
        }
        .tech-container {
          max-width: 1050px;
          margin: 0 auto;
        }
        .tech-title {
          text-align: center;
          font-family: 'Fraunces', serif;
          font-size: clamp(32px, 3.8vw, 44px);
          margin-bottom: 30px;
          color: var(--text-primary);
        }
        .tech-nav-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .tech-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 6px;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 99px;
          border: 1px solid var(--border-color);
          flex: 1;
        }
        .tech-tabs::-webkit-scrollbar {
          display: none;
        }
        .tech-tab-btn {
          padding: 12px 24px;
          font-family: 'Work Sans', sans-serif;
          font-weight: 600;
          font-size: 13.5px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
          border-radius: 99px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tech-tab-btn:hover {
          color: var(--tomato);
          background: rgba(196, 67, 42, 0.08);
        }
        .tech-tab-btn.active {
          color: #FFF;
          background: var(--green-deep);
          box-shadow: 0 4px 16px rgba(30, 58, 41, 0.25);
        }
        [data-theme="dark"] .tech-tab-btn.active {
          background: var(--tomato);
          color: #FFF;
        }
        .nav-arrow-btn {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .nav-arrow-btn:hover {
          background: var(--tomato);
          color: #FFF;
          border-color: var(--tomato);
          transform: scale(1.05);
        }
        .tech-content-box {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 50px -15px rgba(0,0,0,0.08);
          position: relative;
          cursor: grab;
        }
        .tech-content-box:active {
          cursor: grabbing;
        }
        .tech-grid-layout {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 36px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .tech-grid-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        .tech-3d-viewport {
          width: 100%;
          height: 280px;
          position: relative;
          background: rgba(0,0,0,0.02);
          border-radius: 20px;
          border: 1px dashed var(--border-color);
        }
        .tech-row {
          padding: 16px 0;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tech-row:last-child {
          border-bottom: none;
        }
        .tech-row-label {
          font-weight: 700;
          font-size: 15px;
          color: var(--tomato);
        }
        [data-theme="dark"] .tech-row-label {
          color: var(--gold);
        }
        .tech-row-value {
          font-size: 15px;
          line-height: 1.65;
          color: var(--text-primary);
        }
        
        /* Specs grid */
        .specs-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 36px;
        }
        @media (max-width: 768px) {
          .specs-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        .nutrition-card {
          background: rgba(0,0,0,0.02);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
        }
        .nutrition-list {
          list-style: none;
          padding: 0;
          margin: 16px 0 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .nutrition-item {
          display: flex;
          justify-content: space-between;
          font-size: 14.5px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }
        .nutrition-item:last-child {
          border-bottom: none;
        }
        .tech-section-title {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: var(--green-deep);
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 10px;
          margin-bottom: 18px;
        }
        [data-theme="dark"] .tech-section-title {
          color: var(--gold);
        }

        /* Tech & Exporters Section */
        .global-tech-section {
          background: var(--card-bg);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 100px 6vw;
        }
        .global-tech-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 80px;
        }
        @media (max-width: 1024px) {
          .global-tech-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        .tech-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-top: 24px;
        }
        .tech-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .tech-item-icon {
          background: rgba(196, 67, 42, 0.1);
          color: var(--tomato);
          padding: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tech-item-title {
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 4px;
          color: var(--text-primary);
        }
        .tech-item-desc {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        .tech-image-wrap {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border: 1px solid var(--border-color);
        }
        .tech-image-wrap img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.5s ease;
        }
        .tech-image-wrap:hover img {
          transform: scale(1.03);
        }

        /* Exporters Section */
        .exporters-section {
          margin-bottom: 80px;
        }
        .exporters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
        .exporter-card {
          background: rgba(0, 0, 0, 0.02);
          border: 1.5px dashed var(--border-color);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .exporter-card:hover {
          background: var(--card-bg);
          border-color: var(--tomato);
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(196, 67, 42, 0.05);
        }
        .exporter-flag {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }
        .exporter-name {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .exporter-desc {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-secondary);
        }

        /* Royal Co Executive Spotlight Card */
        .royal-spotlight {
          background: linear-gradient(135deg, var(--card-bg) 0%, rgba(227, 162, 61, 0.08) 100%);
          border: 1px solid var(--border-color);
          border-left: 5px solid var(--gold);
          border-radius: 24px;
          padding: 44px 48px;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        [data-theme="dark"] .royal-spotlight {
          background: linear-gradient(135deg, #1A2B1F 0%, #121F16 100%);
          border-color: rgba(255, 255, 255, 0.12);
          border-left-color: var(--gold);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
        }
        .royal-spotlight-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          background: rgba(227, 162, 61, 0.12);
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 16px;
        }
        .royal-spotlight h3 {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        [data-theme="dark"] .royal-spotlight h3 {
          color: #FFFFFF;
        }
        .royal-spotlight p {
          font-size: 15.5px;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .royal-spotlight-quote {
          background: rgba(227, 162, 61, 0.08);
          border-left: 3px solid var(--gold);
          padding: 16px 20px;
          border-radius: 8px;
          font-size: 15px;
          font-style: italic;
          color: var(--text-primary);
          line-height: 1.7;
        }
        [data-theme="dark"] .royal-spotlight-quote {
          background: rgba(227, 162, 61, 0.12);
          color: #F5EFEB;
        }
        [data-theme="dark"] .royal-spotlight p:last-child {
          color: #FFA590;
        }
      `}</style>



      {/* Advanced Floating Glass 3D Navbar with Live 3D Spinning Tomato Logo */}
      <motion.header
        className="nav-wrapper"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
          <a href="#" className="nav-logo">
            <div className="logo-icon-badge" style={{ padding: 2, background: "rgba(196,67,42,0.12)", border: "1px solid rgba(196,67,42,0.3)" }}>
              <Navbar3DLogoCanvas />
            </div>
            <span style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.01em", color: "var(--text-primary)" }}>
              INDUS <span style={{ color: "var(--tomato)" }}>FOOD</span>
            </span>
          </a>

          <div className="nav-links">
            <a href="#story" className="nav-link-item">Our story</a>
            <a href="#lifecycle" className="nav-link-item">How we grow</a>
            <a href="#technical-info" className="nav-link-item">Specs</a>
            <a href="#tech-exporters" className="nav-link-item">Global Market</a>
            <a href="#products" className="nav-link-item">Products</a>
            <a href="#wholesale" className="nav-link-item">Wholesale</a>
            <a href="#reviews" className="nav-link-item">Reviews</a>
          </div>

          <div className="nav-actions">
            {/* Light/Dark mode toggle */}
            <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            <a href="#contact" className="btn-nav-cta">
              <span>Get in touch</span>
              <ArrowRight size={14} />
            </a>

            <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Panel */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
        <a href="#lifecycle" onClick={() => setMenuOpen(false)}>How we grow</a>
        <a href="#technical-info" onClick={() => setMenuOpen(false)}>Technical Info</a>
        <a href="#tech-exporters" onClick={() => setMenuOpen(false)}>Global Market</a>
        <a href="#products" onClick={() => setMenuOpen(false)}>Products</a>
        <a href="#wholesale" onClick={() => setMenuOpen(false)}>Wholesale</a>
        <a href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
        <a href="#contact" className="btn btn-primary" style={{ textAlign: "center", color: "#fff" }} onClick={() => setMenuOpen(false)}>Get in Touch</a>
      </div>

      {/* Hero Block */}
      <header className="hero">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            className="eyebrow on-dark"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Pure Artisanal Tomatoes
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            From vine to jar, <em>nothing</em> in between.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Organic tomato creations prepared directly on the farm. No added water, no industrial paste concentrates, and no preservatives. Just the pure, sun-drenched taste of real tomatoes cooked slowly with care.
          </motion.p>
          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
          >
            <motion.a
              href="#products"
              className="btn btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore products <ChevronRight size={17} />
            </motion.a>
            <motion.a
              href="#wholesale"
              className="btn btn-outline"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              Bulk Calculator
            </motion.a>
          </motion.div>
          <motion.div
            className="workspace-trust-strip"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.8 }
              }
            }}
          >
            <div className="trust-strip">
              <motion.div className="trust-item" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <Leaf size={16} color="var(--gold)" /> 100% Organic & Raw
              </motion.div>
              <motion.div className="trust-item" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <Droplet size={16} color="var(--gold)" /> No Added Fillers
              </motion.div>
              <motion.div className="trust-item" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <Truck size={16} color="var(--gold)" /> Farm Sealed within 48h
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Interactive 3D WebGL Hero Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{ justifySelf: "center", width: "100%", maxWidth: 520, position: "relative", minHeight: 400 }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.15, pointerEvents: "none" }}>
            <HeroIllustration mouseX={mouseX} mouseY={mouseY} />
          </div>
          <Hero3DCanvas />
        </motion.div>
      </header>

      <VineDivider />

      {/* Story Section */}
      <section className="story" id="story">
        <motion.div
          className="story-copy"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="eyebrow">Our heritage</span>
          <h2>Grown in the field, not in a laboratory.</h2>
          <p style={{ fontWeight: 500, fontSize: "17.5px", color: "var(--tomato)", marginBottom: "24px", lineHeight: "1.7" }}>
            Tomato purée, a vibrant red concentrate that forms the base of countless culinary creations, boasts a rich history and surprisingly complex production process. Let's delve into the world of this essential ingredient, exploring its packaging, production journey, technological marvels involved, and leading exporters.
          </p>
          <p>
            Indus Foods was founded upon a simple tenet: the finest meals begin with the finest ingredients. We work with farmers who allow fruit to reach absolute ripeness on the vine. We move it from harvest to container within two days—no freezing, no chemically altered paste, and no artificial shortcuts.
          </p>
          <p>
            Every single harvest is checked by hand before it leaves our family plant. We promise that the deep tomato flavor that enters your kitchen is the same delicious taste we enjoyed on the vine.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <motion.a
              href="#lifecycle"
              className="btn btn-outline-dark"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Growth Lifecycle <ChevronRight size={16} />
            </motion.a>
            <motion.a
              href="#technical-info"
              className="btn btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              View Technical Info <ChevronRight size={16} />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          className="story-art"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
        >
          <img
            src={heritageImg}
            alt="Canned Tomato Purée"
            style={{
              width: "100%",
              height: "100%",
              maxHeight: "360px",
              borderRadius: "16px",
              objectFit: "cover"
            }}
          />
        </motion.div>
      </section>

      <VineDivider />

      {/* Tomato Lifecycle Widget */}
      <section className="lifecycle-section" id="lifecycle">
        <div className="section-head">
          <span className="eyebrow">The Life of a Tomato</span>
          <h2>Track the Growth & Quality</h2>
          <p>Explore how our organic tomatoes develop from initial seedling sprouts to caramelized purée, complete with real-time laboratory quality metrics.</p>
        </div>

        <div className="lifecycle-container">
          <div className="lifecycle-tabs">
            {LIFECYCLE_STAGES.map((stage) => (
              <button
                key={stage.id}
                className={`lifecycle-tab ${activeStage.id === stage.id ? "active" : ""}`}
                onClick={() => setActiveStage(stage)}
              >
                {stage.name}
                {activeStage.id === stage.id && (
                  <motion.div className="lifecycle-tab-bar" layoutId="stageUnderline" />
                )}
              </button>
            ))}
          </div>

          <div className="lifecycle-content">
            <div className="stage-visual" style={{ position: "relative", flexDirection: "column" }}>
              <div style={{ position: "absolute", top: 12, left: 16, fontSize: "11px", color: "var(--tomato)", fontWeight: 700, letterSpacing: "0.1em" }}>
                3D LIFECYCLE MODEL
              </div>
              <Lifecycle3DViewport stageId={activeStage.id} />
            </div>
            <div className="stage-details">
              <span className="stage-day">{activeStage.day}</span>
              <h3>{activeStage.name}</h3>
              <p className="stage-description">{activeStage.description}</p>

              <div className="stage-metrics">
                <div className="metric-card">
                  <div className="metric-title">Brix Sweetness</div>
                  <div className="metric-val">{activeStage.brix}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-title">Natural Acidity</div>
                  <div className="metric-val">{activeStage.acidity}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-title">Lycopene Output</div>
                  <div className="metric-val">{activeStage.lycopene}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VineDivider />

      {/* Product Technical Information Section */}
      <motion.section
        className="tech-section"
        id="technical-info"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="tech-container">
          <h2 className="tech-title">Product Technical Information</h2>

          <div className="tech-nav-bar">
            <button
              className="nav-arrow-btn"
              onClick={() => {
                const keys = Object.keys(TECHNICAL_INFO);
                const currentIdx = keys.indexOf(activeTechTab);
                const prevIdx = (currentIdx - 1 + keys.length) % keys.length;
                setActiveTechTab(keys[prevIdx]);
              }}
              aria-label="Previous Section"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="tech-tabs">
              {Object.keys(TECHNICAL_INFO).map((key) => (
                <button
                  key={key}
                  className={`tech-tab-btn ${activeTechTab === key ? "active" : ""}`}
                  onClick={() => setActiveTechTab(key)}
                >
                  {TECHNICAL_INFO[key].title}
                </button>
              ))}
            </div>

            <button
              className="nav-arrow-btn"
              onClick={() => {
                const keys = Object.keys(TECHNICAL_INFO);
                const currentIdx = keys.indexOf(activeTechTab);
                const nextIdx = (currentIdx + 1) % keys.length;
                setActiveTechTab(keys[nextIdx]);
              }}
              aria-label="Next Section"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <motion.div
            key={activeTechTab}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(e, { offset, velocity }) => {
              const keys = Object.keys(TECHNICAL_INFO);
              const currentIdx = keys.indexOf(activeTechTab);
              if (offset.x < -40 || velocity.x < -200) {
                const nextIdx = (currentIdx + 1) % keys.length;
                setActiveTechTab(keys[nextIdx]);
              } else if (offset.x > 40 || velocity.x > 200) {
                const prevIdx = (currentIdx - 1 + keys.length) % keys.length;
                setActiveTechTab(keys[prevIdx]);
              }
            }}
            className="tech-content-box"
          >
            <div className="tech-grid-layout">
              {/* Left Column: Interactive 3D Technical Inspection Viewport */}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: 280,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.02)",
                  borderRadius: 20,
                  border: "1px dashed var(--border-color)",
                  overflow: "hidden"
                }}>
                  <div style={{ position: "absolute", opacity: 0.6, pointerEvents: "none" }}>
                    <JarIllustration tone={activeTechTab === "packaging" ? "gold" : "tomato"} />
                  </div>
                  <Tech3DModelViewport tab={activeTechTab} />
                </div>
              </div>

              {/* Right Column: Specifications Data */}
              <div>
                {activeTechTab === "summary" && (
                  <div>
                    {TECHNICAL_INFO.summary.data.map((item, idx) => (
                      <div key={idx} className="tech-row">
                        <div className="tech-row-label">{item.label}:</div>
                        <div className="tech-row-value">{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTechTab === "packaging" && (
                  <div>
                    {TECHNICAL_INFO.packaging.data.map((item, idx) => (
                      <div key={idx} className="tech-row" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <div className="tech-row-label" style={{ margin: 0 }}>{item.label}:</div>
                        <div className="tech-row-value">{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTechTab === "specifications" && (
                  <div className="specs-grid">
                    <div className="nutrition-card">
                      <div className="tech-row-label" style={{ fontSize: "15px", marginBottom: "8px", color: "var(--tomato)" }}>
                        Nutritional Value <span style={{ fontWeight: "normal", fontSize: "13px", color: "var(--text-secondary)" }}>({TECHNICAL_INFO.specifications.nutritionalValue.serving})</span>
                      </div>
                      <ul className="nutrition-list">
                        {TECHNICAL_INFO.specifications.nutritionalValue.values.map((item, idx) => (
                          <li key={idx} className="nutrition-item">
                            <span style={{ color: "var(--text-secondary)" }}>{item.name}:</span>
                            <strong style={{ color: "var(--tomato)" }}>{item.amount}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      {TECHNICAL_INFO.specifications.data.map((item, idx) => (
                        <div key={idx} className="tech-row">
                          <div className="tech-row-label">{item.label}:</div>
                          <div className="tech-row-value" style={{ whiteSpace: "pre-line" }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTechTab === "analysis" && (
                  <div>
                    <div className="tech-section-title">Physical and Chemical Tests</div>
                    <div style={{ marginBottom: "24px" }}>
                      {TECHNICAL_INFO.analysis.tests.map((item, idx) => (
                        <div key={idx} className="tech-row" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                          <div className="tech-row-label" style={{ margin: 0 }}>{item.label}:</div>
                          <div className="tech-row-value">{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="tech-section-title">Organoleptic Properties</div>
                    <div>
                      {TECHNICAL_INFO.analysis.organoleptic.map((item, idx) => (
                        <div key={idx} className="tech-row">
                          <div className="tech-row-label">{item.label}:</div>
                          <div className="tech-row-value">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border-color)",
              fontSize: "12.5px",
              color: "var(--text-secondary)"
            }}>
              <span>← Drag / swipe horizontally or use arrow buttons to switch sections →</span>
              <span style={{ fontWeight: 600, color: "var(--tomato)" }}>
                {Object.keys(TECHNICAL_INFO).indexOf(activeTechTab) + 1} / {Object.keys(TECHNICAL_INFO).length}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <VineDivider />

      {/* Products Section */}
      <section className="products" id="products">
        <div className="section-head">
          <span className="eyebrow">Artisanal Selection</span>
          <h2>A pantry built on one good tomato.</h2>
          <p>Four clean products, one golden guideline: vine-ripened crop, slow-simmered cooking, nothing artificial.</p>
        </div>

        <motion.div
          className="product-grid"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {PRODUCTS.map((p) => (
            <motion.div
              key={p.name}
              className={`product-card ${p.featured ? "featured" : ""}`}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              whileHover={{
                y: -10,
                boxShadow: "0 22px 40px -20px rgba(0,0,0,0.2)",
                transition: { duration: 0.25, ease: "easeOut" }
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="product-tag">{p.featured ? "Best seller" : "Indus Classic"}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, opacity: 0.85, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={12} /> 3D Model
                </span>
              </div>

              <div style={{ position: "relative", width: "100%", height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", opacity: 0.25, pointerEvents: "none" }}>
                  <JarIllustration tone={p.tone} />
                </div>
                <Product3DViewport productTone={p.tone} productName={p.name} />
              </div>

              <h3>{p.name}</h3>
              <p>{p.desc}</p>

              <button
                className="btn-3d-inspect"
                onClick={() => setInspectProduct(p)}
              >
                <Eye size={15} /> 360° 3D View
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>



      {/* Production steps */}
      <section className="process" id="process">
        <div className="section-head">
          <span className="eyebrow">The Processing Line</span>
          <h2>From Vine to Sealed Jar in Four Steps</h2>
        </div>
        <motion.div
          className="process-grid"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {STEPS.map((s) => (
            <motion.div
              className="step"
              key={s.n}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
            >
              <span className="n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <VineDivider />

      {/* Global Reach, Packaging, and Tech Section */}
      <section className="global-tech-section" id="tech-exporters">
        <div className="tech-container">

          {/* Aseptic Packaging Benefits */}
          <div className="global-tech-grid">
            <div>
              <span className="eyebrow">Advanced Processing</span>
              <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "36px", margin: "8px 0 16px" }}>Aseptic Packaging Benefits</h2>
              <h4 style={{ fontWeight: 600, color: "var(--tomato)", marginBottom: "20px" }}>The Technological Marvels Behind the Scenes</h4>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "24px" }}>
                Modern tomato purée production relies heavily on advanced technologies to preserve freshness, lock in nutritional value, and deliver the highest food safety standards.
              </p>

              <div className="tech-list">
                <div className="tech-item">
                  <div className="tech-item-icon">
                    <Droplet size={20} />
                  </div>
                  <div>
                    <h5 className="tech-item-title">Industrial Washing Systems</h5>
                    <p className="tech-item-desc">High-pressure water sprays and automated sorting mechanisms ensure efficient cleaning and quality control.</p>
                  </div>
                </div>

                <div className="tech-item">
                  <div className="tech-item-icon">
                    <Award size={20} />
                  </div>
                  <div>
                    <h5 className="tech-item-title">Evaporators</h5>
                    <p className="tech-item-desc">These sophisticated machines utilize vacuum pressure or controlled heat to efficiently remove water and concentrate the tomatoes.</p>
                  </div>
                </div>

                <div className="tech-item">
                  <div className="tech-item-icon">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h5 className="tech-item-title">Aseptic Filling</h5>
                    <p className="tech-item-desc">This technology ensures sterile packaging, extending shelf life and minimizing the risk of contamination.</p>
                  </div>
                </div>

                <div className="tech-item">
                  <div className="tech-item-icon">
                    <Leaf size={20} />
                  </div>
                  <div>
                    <h5 className="tech-item-title">Process Automation</h5>
                    <p className="tech-item-desc">Production lines are often highly automated, with sensors and computers monitoring and controlling various stages.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tech-image-wrap">
              <img src={heritageImg} alt="Sterile tomato puree packaging line" style={{ maxHeight: "400px", objectFit: "cover" }} />
            </div>
          </div>

          {/* Leading Exporters of Tomato Purée */}
          <div className="exporters-section">
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span className="eyebrow">Global Supply Chain</span>
              <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "36px", margin: "8px 0 12px" }}>Leading Exporters of Tomato Purée</h2>
              <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
                The tomato purée market is a global one, with several countries vying for the top spot to supply kitchens worldwide.
              </p>
            </div>

            <div className="exporters-grid">
              <div className="exporter-card">
                <span className="exporter-flag">🇮🇹</span>
                <h4 className="exporter-name">Italy</h4>
                <p className="exporter-desc">Renowned for high-quality tomatoes, rich flavor, and vibrant color output.</p>
              </div>
              <div className="exporter-card">
                <span className="exporter-flag">🇨🇳</span>
                <h4 className="exporter-name">China</h4>
                <p className="exporter-desc">A major player with significant export volume, often at competitive prices.</p>
              </div>
              <div className="exporter-card">
                <span className="exporter-flag">🇪🇸</span>
                <h4 className="exporter-name">Spain</h4>
                <p className="exporter-desc">Flourishes due to ideal climate, delivering consistent global quality.</p>
              </div>
              <div className="exporter-card">
                <span className="exporter-flag">🇵🇹</span>
                <h4 className="exporter-name">Portugal</h4>
                <p className="exporter-desc">Thriving tomato industry, notably exporting to European markets.</p>
              </div>
              <div className="exporter-card">
                <span className="exporter-flag">🇺🇸</span>
                <h4 className="exporter-name">United States</h4>
                <p className="exporter-desc">Significant producer with California serving as a key growing region.</p>
              </div>
            </div>
          </div>

          {/* Indus Food Executive Spotlight Card */}
          <div className="royal-spotlight">
            <div className="royal-spotlight-badge">
              <Award size={14} />
              <span>Global Trusted Enterprise</span>
            </div>
            <h3>Indus Food: A Trusted Name in Tomato Purée</h3>
            <p>
              Indus Food has established itself as a prominent player in the global tomato purée market. Sourcing high-quality tomatoes from rich harvests, they ensure a delicious, rich, and consistent product. Utilizing state-of-the-art modern technologies in their production process, Indus Food guarantees world-class food safety, hygiene, and efficiency.
            </p>
            <div className="royal-spotlight-quote">
              "Whether you're a home cook whipping up a quick pasta sauce or a professional executive chef crafting a signature dish, Indus Food tomato purée continues to be an essential mainstay in gourmet kitchens worldwide."
            </div>
          </div>

        </div>
      </section>

      <VineDivider />

      {/* Wholesale & Bulk Calculator */}
      <section className="wholesale-section" id="wholesale">
        <div className="section-head">
          <span className="eyebrow" style={{ color: "var(--gold)" }}>Commercial Portal</span>
          <h2>Bulk Order & Quote Estimator</h2>
          <p>Calculate your custom discount level, estimated cargo weight, and coordinate delivery routes directly using our simulator.</p>
        </div>

        <div className="wholesale-container">
          <div className="estimator-sliders">
            <h3 style={{ color: "#FFF", fontSize: "22px" }}>Select Industrial Volume</h3>
            <p style={{ fontSize: "14.5px" }}>Choose packaging formats for bulk industrial supply (20ft/40ft FCL container lots).</p>

            <div className="control-group">
              <span className="control-label" style={{ color: "#FFF" }}>
                Aseptic Purée Drums (240kg): <span style={{ color: "var(--gold)" }}>{pureeDrums} drums</span>
              </span>
              <input
                type="range"
                min="0"
                max="200"
                value={pureeDrums}
                onChange={(e) => setPureeDrums(parseInt(e.target.value))}
                className="slider-input"
              />
            </div>

            <div className="control-group">
              <span className="control-label" style={{ color: "#FFF" }}>
                Aseptic Paste Drums (240kg): <span style={{ color: "var(--gold)" }}>{pasteDrums} drums</span>
              </span>
              <input
                type="range"
                min="0"
                max="200"
                value={pasteDrums}
                onChange={(e) => setPasteDrums(parseInt(e.target.value))}
                className="slider-input"
              />
            </div>

            <div className="control-group">
              <span className="control-label" style={{ color: "#FFF" }}>
                Industrial Flexitanks (20 MT): <span style={{ color: "var(--gold)" }}>{flexitanks} flexitanks</span>
              </span>
              <input
                type="range"
                min="0"
                max="10"
                value={flexitanks}
                onChange={(e) => setFlexitanks(parseInt(e.target.value))}
                className="slider-input"
              />
            </div>

            <div className="control-group">
              <span className="control-label" style={{ color: "#FFF" }}>Logistics Routing:</span>
              <div style={{ display: "flex", gap: "10px" }}>
                {[
                  { id: "ocean_lcl", name: "Sea LCL Cargo (10-15 days)" },
                  { id: "ocean_fcl", name: "Container FCL (7-10 days)" },
                  { id: "air_cargo", name: "Air Freight (2-3 days)" }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    className={`recipe-tab-btn ${shippingTier === tier.id ? "active" : ""}`}
                    onClick={() => setShippingTier(tier.id)}
                    style={{
                      flex: 1,
                      fontSize: "12px",
                      padding: "10px 6px",
                      color: shippingTier === tier.id ? "var(--tomato)" : "#FFF",
                      borderColor: shippingTier === tier.id ? "var(--tomato)" : "rgba(255,255,255,0.2)"
                    }}
                  >
                    {tier.name}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--gold)", letterSpacing: "0.05em" }}>REAL-TIME 3D PALLET STACK</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>{totalDrums} Aseptic Drums Loaded</span>
              </div>
              <Wholesale3DViewport drumCount={pureeDrums + pasteDrums} flexitankCount={flexitanks} />
            </div>
          </div>

          <div className="invoice-sheet">
            <div className="invoice-title">
              <span>FOB Order Quote</span>
              <Award size={20} color="var(--tomato)" />
            </div>

            <div className="invoice-row">
              <span>Subtotal ({totalDrums} drums / {flexitanks} flexitanks)</span>
              <strong>${rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>

            <div className="invoice-row" style={{ color: "var(--tomato)" }}>
              <span>Volume Discount ({discountPercent}%)</span>
              <strong>-${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>

            <div className="invoice-row">
              <span>Total Cargo Weight</span>
              <strong>{totalWeight.toLocaleString()} lbs ({totalTonnage.toFixed(2)} MT)</strong>
            </div>

            <div className="invoice-row">
              <span>Freight Cargo Fee ({shippingTier.replace('_', ' ').toUpperCase()})</span>
              <strong>${baseShipping.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>

            <div className="invoice-divider" />

            <div className="invoice-row">
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Contract Status:</span>
              <strong style={{ fontSize: "13px" }}>{tierLabel}</strong>
            </div>

            <div className="invoice-total">
              <span>Estimated FOB Cost</span>
              <span>${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="tomato-count-badge">
              🍅 This industrial contract handles an estimated <strong>{estimatedTomatoes.toLocaleString()}</strong> vine-grown tomatoes from harvest!
            </div>
          </div>
        </div>
      </section>

      {/* Stats counter strip */}
      <section className="stats section-dark">
        <motion.div
          className="stats-grid"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.12 }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {STATS.map((s) => (
            <motion.div
              className="stat"
              key={s.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <div className="value">
                <Counter value={s.value} />
              </div>
              <div className="label">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Partner Testimonials Section */}
      <section className="reviews-section" id="reviews">
        <div className="section-head">
          <span className="eyebrow">Industry Verification</span>
          <h2>Partner Testimonials</h2>
          <p>Read opinions directly from leading food brands, commercial sauce manufacturers, and global supply chain partners who trust our bulk aseptic tomato purée shipments.</p>
        </div>

        <div className="reviews-container">
          <div className="reviews-layout">
            <div className="reviews-list-col">
              {reviews.map((rev) => (
                <div key={rev.id} className="review-card">
                  <div className="review-header">
                    <div>
                      <div className="reviewer-name">{rev.name}</div>
                      <div className="review-date">{rev.date}</div>
                    </div>
                    <div className="stars-container">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <TomatoIcon
                          key={i}
                          size={16}
                          fill={i < rev.rating ? "var(--tomato)" : "none"}
                          stroke="var(--tomato)"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment" style={{ fontSize: "15px", lineHeight: "1.7", fontStyle: "italic" }}>"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <VineDivider />

      {/* Testimonials block */}
      <section className="testimonial">
        <motion.div
          className="testimonial-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <Quote size={26} color="var(--gold)" />
          <blockquote>
            "The purée has a natural field freshness you can taste on the first spoonful — it has quickly become the primary base for every simmer sauce in our kitchen."
          </blockquote>
          <cite>— Chef Ayesha Raza, Michelin Starred Kitchen Director</cite>
        </motion.div>
      </section>

      {/* Call to action section */}
      <section className="cta" id="contact">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 15 }}
        >
          <ShieldCheck size={36} style={{ marginBottom: 18 }} />
          <h2>Bring Indus Foods into your kitchen.</h2>
          <p>Wholesale distribution logistics, restaurant requests, or recipes questions — get in touch with our farm today.</p>
          <motion.a
            href="mailto:hello@indusfood.example"
            className="btn"
            style={{ background: "#FCFAF4", color: "var(--tomato)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Farm Dispatch Request <ArrowRight size={17} />
          </motion.a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-logo">Indus Food</div>
            <p style={{ maxWidth: 280, fontSize: 14.5 }}>Premium heirloom tomatoes, hand-selected and crafted with care, straight from our family fields.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Products</h4>
              <a href="#products">Tomato Purée</a>
              <a href="#products">Tomato Ketchup</a>
              <a href="#products">Tomato Paste</a>
              <a href="#products">Garlic Chili Sauce</a>
            </div>
            <div className="footer-col">
              <h4>Commercial</h4>
              <a href="#wholesale">Bulk Pricing</a>
              <a href="#lifecycle">Quality Lab</a>
              <a href="#recipes">Recipe Matcher</a>
            </div>
            <div className="footer-col">
              <h4>Heritage</h4>
              <a href="#story">Our story</a>
              <a href="#process">Harvest Steps</a>
              <a href="#reviews">Testimonials</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Indus Food International. All rights reserved.</span>
          <span>Made with organic care, from farm fields to gourmet jar.</span>
        </div>
      </footer>

      {/* 360° Product Inspector Modal */}
      <Inspect3DModal product={inspectProduct} onClose={() => setInspectProduct(null)} />
    </div>
  );
}
