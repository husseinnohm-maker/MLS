// Complete warehouse hierarchy extracted from PCR Excel
export const REGIONS = [
  { id: "JCW", name: "JCW" },
  { id: "Jed", name: "Jeddah" },
  { id: "Center", name: "Center" },
  { id: "East", name: "East" },
  { id: "North", name: "North" },
  { id: "South", name: "South" },
  { id: "Madina", name: "Madina" },
];

export const WAREHOUSES = {
  JCW: [{ id: "JCW_Main", name: "JCW Main" }],
  Jed: [
    { id: "UWC_Khadija", name: "UWC & Khadija" },
    { id: "Khumra_2", name: "Khumra 2" },
    { id: "Khumra_3", name: "Khumra 3" },
  ],
  Center: [
    { id: "RCW", name: "RCW" },
    { id: "RW2", name: "RW2" },
    { id: "ACW", name: "ACW" },
    { id: "Motoon", name: "Motoon" },
  ],
  East: [{ id: "East_Main", name: "East Main" }],
  North: [{ id: "North_Main", name: "North Main" }],
  South: [
    { id: "Khamis_Main", name: "Khamis Main" },
    { id: "Rice_Sub", name: "Rice Sub" },
  ],
  Madina: [{ id: "Madina_Main", name: "Madina Main" }],
};

export const ROOMS = {
  JCW_Main: ["ROOM#1","ROOM#2","ROOM#3","ROOM#4","ROOM#5","ROOM#6","ROOM#7","ROOM#8","ROOM#9","ROOM#10"],
  UWC_Khadija: ["UWC & Khadija"],
  Khumra_2: ["KHUMRA 2(1)","KHUMRA 2(2)"],
  Khumra_3: ["KHUMRA 3(1)","KHUMRA 3(2)","KHUMRA 3(3)"],
  RCW: ["ROOM#1","ROOM#2","ROOM#3","ROOM#4","ROOM#5","ROOM#8","ROOM#9","OPEN AREA"],
  RW2: ["RW2"],
  ACW: ["ROOM#1","ROOM#2","ROOM#3","ROOM#4","ROOM#5"],
  Motoon: ["Motoon"],
  East_Main: ["ROOM#1","ROOM#2","ROOM#3","ROOM#4","ROOM#5"],
  North_Main: ["ROOM#1","ROOM#2","ROOM#3","ROOM#4","ROOM#5","ROOM#6","ROOM#7","ROOM#8"],
  Khamis_Main: ["ROOM#1","ROOM#2","ROOM#3","ROOM#4"],
  Rice_Sub: ["ROOM#5","ROOM#6","ROOM#7","ROOM#8","ROOM#Chill","ROOM#Frozen"],
  Madina_Main: ["ROOM#1","ROOM#2","ROOM#3","ROOM#4"],
};

export const TEMP_ZONES = [
  "Dry",
  "Ambient",
  "Chilled +18",
  "Chilled +5",
  "Frozen",
];

export const DIVISIONS = [
  "FSS",
  "SOLEN",
  "Mars",
  "MARS KSA",
  "RB",
  "SUT-RB",
  "LOR",
  "CGD",
  "MDLZ",
  "3PL",
  "SANBEEL",
];

export const STAGING_REASONS = [
  { id: "staging_not_received", label: "Not Received from Inbound" },
  { id: "staging_damage", label: "Damage" },
  { id: "staging_invoiced_waiting", label: "Invoiced & Waiting to Load" },
  { id: "staging_returned", label: "Returned / Redelivery" },
  { id: "staging_picked_waiting", label: "Picked & Waiting for Delivery" },
];

// Flat list of all warehouses for user assignment
export const ALL_WAREHOUSES = Object.entries(WAREHOUSES).flatMap(
  ([region, whs]) => whs.map((wh) => ({ ...wh, region }))
);