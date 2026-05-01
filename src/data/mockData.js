export const PROPERTIES = [
  {
    id: "marriott-sfo",
    name: "Marriott SFO",
    brand: "Marriott",
    location: "San Francisco, CA",
    rooms: 412,
    tier: "full-service",
    successRate: 94.2,
    totalCalls: 3847,
    revenueRecovered: 128400,
    escalationRate: 5.8,
    avgHandleTime: 42,
    npsScore: 4.6,
    callsByType: [
      { type: "Reservations", total: 1240, success: 1189, escalated: 51 },
      { type: "Restaurant", total: 820, success: 790, escalated: 30 },
      { type: "Maintenance", total: 610, success: 556, escalated: 54 },
      { type: "Concierge", total: 720, success: 701, escalated: 19 },
      { type: "Billing", total: 457, success: 421, escalated: 36 },
    ],
    trend: [
      { week: "W1", successRate: 91.2, calls: 890 },
      { week: "W2", successRate: 92.8, calls: 940 },
      { week: "W3", successRate: 93.1, calls: 980 },
      { week: "W4", successRate: 94.2, calls: 1037 },
    ],
    escalations: [
      { id: "ESC-001", type: "Billing", reason: "Overcharge dispute", time: "2h ago", status: "resolved", agentTime: 8 },
      { id: "ESC-002", type: "Maintenance", reason: "Room AC not working", time: "4h ago", status: "resolved", agentTime: 12 },
      { id: "ESC-003", type: "Reservations", reason: "Special request not fulfilled", time: "6h ago", status: "pending", agentTime: null },
    ],
  },
  {
    id: "hilton-nyc",
    name: "Hilton NYC Midtown",
    brand: "Hilton",
    location: "New York, NY",
    rooms: 567,
    tier: "full-service",
    successRate: 88.7,
    totalCalls: 5124,
    revenueRecovered: 214700,
    escalationRate: 11.3,
    avgHandleTime: 58,
    npsScore: 4.2,
    callsByType: [
      { type: "Reservations", total: 1820, success: 1638, escalated: 182 },
      { type: "Restaurant", total: 1050, success: 941, escalated: 109 },
      { type: "Maintenance", total: 890, success: 765, escalated: 125 },
      { type: "Concierge", total: 940, success: 896, escalated: 44 },
      { type: "Billing", total: 424, success: 352, escalated: 72 },
    ],
    trend: [
      { week: "W1", successRate: 85.4, calls: 1180 },
      { week: "W2", successRate: 86.9, calls: 1240 },
      { week: "W3", successRate: 88.1, calls: 1320 },
      { week: "W4", successRate: 88.7, calls: 1384 },
    ],
    escalations: [
      { id: "ESC-014", type: "Reservations", reason: "Double booking issue", time: "1h ago", status: "pending", agentTime: null },
      { id: "ESC-015", type: "Restaurant", reason: "Dietary restriction not noted", time: "3h ago", status: "resolved", agentTime: 15 },
      { id: "ESC-016", type: "Maintenance", reason: "Elevator wait complaint", time: "5h ago", status: "resolved", agentTime: 9 },
    ],
  },
  {
    id: "hyatt-la",
    name: "Grand Hyatt LA",
    brand: "Hyatt",
    location: "Los Angeles, CA",
    rooms: 348,
    tier: "full-service",
    successRate: 96.1,
    totalCalls: 2913,
    revenueRecovered: 97200,
    escalationRate: 3.9,
    avgHandleTime: 38,
    npsScore: 4.8,
    callsByType: [
      { type: "Reservations", total: 980, success: 960, escalated: 20 },
      { type: "Restaurant", total: 720, success: 708, escalated: 12 },
      { type: "Maintenance", total: 480, success: 459, escalated: 21 },
      { type: "Concierge", total: 510, success: 502, escalated: 8 },
      { type: "Billing", total: 223, success: 209, escalated: 14 },
    ],
    trend: [
      { week: "W1", successRate: 94.8, calls: 680 },
      { week: "W2", successRate: 95.3, calls: 720 },
      { week: "W3", successRate: 95.8, calls: 750 },
      { week: "W4", successRate: 96.1, calls: 763 },
    ],
    escalations: [
      { id: "ESC-031", type: "Billing", reason: "Late checkout fee dispute", time: "30m ago", status: "pending", agentTime: null },
      { id: "ESC-032", type: "Concierge", reason: "Tour booking unavailable", time: "7h ago", status: "resolved", agentTime: 6 },
    ],
  },
  {
    id: "westin-chicago",
    name: "The Westin Chicago",
    brand: "Westin",
    location: "Chicago, IL",
    rooms: 407,
    tier: "full-service",
    successRate: 91.4,
    totalCalls: 3412,
    revenueRecovered: 115800,
    escalationRate: 8.6,
    avgHandleTime: 51,
    npsScore: 4.4,
    callsByType: [
      { type: "Reservations", total: 1150, success: 1068, escalated: 82 },
      { type: "Restaurant", total: 780, success: 718, escalated: 62 },
      { type: "Maintenance", total: 620, success: 550, escalated: 70 },
      { type: "Concierge", total: 590, success: 558, escalated: 32 },
      { type: "Billing", total: 272, success: 242, escalated: 30 },
    ],
    trend: [
      { week: "W1", successRate: 89.2, calls: 800 },
      { week: "W2", successRate: 90.1, calls: 840 },
      { week: "W3", successRate: 91.0, calls: 870 },
      { week: "W4", successRate: 91.4, calls: 902 },
    ],
    escalations: [
      { id: "ESC-045", type: "Maintenance", reason: "Noise complaint unresolved", time: "2h ago", status: "resolved", agentTime: 11 },
      { id: "ESC-046", type: "Reservations", reason: "Early check-in denied", time: "5h ago", status: "resolved", agentTime: 7 },
      { id: "ESC-047", type: "Restaurant", reason: "Reservation not found", time: "8h ago", status: "pending", agentTime: null },
    ],
  },
  {
    id: "fourseasons-miami",
    name: "Four Seasons Miami",
    brand: "Four Seasons",
    location: "Miami, FL",
    rooms: 221,
    tier: "luxury",
    successRate: 97.8,
    totalCalls: 1872,
    revenueRecovered: 143600,
    escalationRate: 2.2,
    avgHandleTime: 34,
    npsScore: 4.9,
    callsByType: [
      { type: "Reservations", total: 580, success: 575, escalated: 5 },
      { type: "Restaurant", total: 490, success: 485, escalated: 5 },
      { type: "Maintenance", total: 280, success: 272, escalated: 8 },
      { type: "Concierge", total: 380, success: 377, escalated: 3 },
      { type: "Billing", total: 142, success: 139, escalated: 3 },
    ],
    trend: [
      { week: "W1", successRate: 97.1, calls: 440 },
      { week: "W2", successRate: 97.4, calls: 460 },
      { week: "W3", successRate: 97.6, calls: 480 },
      { week: "W4", successRate: 97.8, calls: 492 },
    ],
    escalations: [
      { id: "ESC-060", type: "Concierge", reason: "Private chef request complexity", time: "3h ago", status: "resolved", agentTime: 4 },
      { id: "ESC-061", type: "Billing", reason: "VIP rate adjustment", time: "9h ago", status: "resolved", agentTime: 8 },
    ],
  },
  {
    id: "sheraton-boston",
    name: "Sheraton Boston",
    brand: "Sheraton",
    location: "Boston, MA",
    rooms: 379,
    tier: "full-service",
    successRate: 82.3,
    totalCalls: 3018,
    revenueRecovered: 78900,
    escalationRate: 17.7,
    avgHandleTime: 71,
    npsScore: 3.9,
    callsByType: [
      { type: "Reservations", total: 1040, success: 873, escalated: 167 },
      { type: "Restaurant", total: 680, success: 548, escalated: 132 },
      { type: "Maintenance", total: 570, success: 451, escalated: 119 },
      { type: "Concierge", total: 490, success: 418, escalated: 72 },
      { type: "Billing", total: 238, success: 195, escalated: 43 },
    ],
    trend: [
      { week: "W1", successRate: 79.8, calls: 710 },
      { week: "W2", successRate: 80.5, calls: 740 },
      { week: "W3", successRate: 81.4, calls: 768 },
      { week: "W4", successRate: 82.3, calls: 800 },
    ],
    escalations: [
      { id: "ESC-072", type: "Reservations", reason: "Group block availability issue", time: "45m ago", status: "pending", agentTime: null },
      { id: "ESC-073", type: "Maintenance", reason: "Pool closure not communicated", time: "2h ago", status: "pending", agentTime: null },
      { id: "ESC-074", type: "Restaurant", reason: "Long wait time complaint", time: "4h ago", status: "resolved", agentTime: 18 },
      { id: "ESC-075", type: "Billing", reason: "Incorrect room rate charged", time: "6h ago", status: "resolved", agentTime: 22 },
    ],
  },
  {
    id: "ritz-dc",
    name: "The Ritz-Carlton DC",
    brand: "Ritz-Carlton",
    location: "Washington, DC",
    rooms: 300,
    tier: "luxury",
    successRate: 95.4,
    totalCalls: 2241,
    revenueRecovered: 187300,
    escalationRate: 4.6,
    avgHandleTime: 36,
    npsScore: 4.8,
    callsByType: [
      { type: "Reservations", total: 720, success: 695, escalated: 25 },
      { type: "Restaurant", total: 580, success: 561, escalated: 19 },
      { type: "Maintenance", total: 390, success: 370, escalated: 20 },
      { type: "Concierge", total: 420, success: 412, escalated: 8 },
      { type: "Billing", total: 131, success: 123, escalated: 8 },
    ],
    trend: [
      { week: "W1", successRate: 93.8, calls: 530 },
      { week: "W2", successRate: 94.5, calls: 550 },
      { week: "W3", successRate: 95.1, calls: 570 },
      { week: "W4", successRate: 95.4, calls: 591 },
    ],
    escalations: [
      { id: "ESC-088", type: "Concierge", reason: "Last-minute dinner reservation", time: "1h ago", status: "resolved", agentTime: 5 },
      { id: "ESC-089", type: "Maintenance", reason: "VIP suite preparation delay", time: "6h ago", status: "resolved", agentTime: 14 },
    ],
  },
  {
    id: "doubletree-seattle",
    name: "DoubleTree Seattle",
    brand: "Hilton",
    location: "Seattle, WA",
    rooms: 316,
    tier: "select-service",
    successRate: 86.9,
    totalCalls: 2609,
    revenueRecovered: 61400,
    escalationRate: 13.1,
    avgHandleTime: 63,
    npsScore: 4.0,
    callsByType: [
      { type: "Reservations", total: 920, success: 811, escalated: 109 },
      { type: "Restaurant", total: 540, success: 468, escalated: 72 },
      { type: "Maintenance", total: 480, success: 406, escalated: 74 },
      { type: "Concierge", total: 420, success: 376, escalated: 44 },
      { type: "Billing", total: 249, success: 207, escalated: 42 },
    ],
    trend: [
      { week: "W1", successRate: 84.2, calls: 610 },
      { week: "W2", successRate: 85.3, calls: 640 },
      { week: "W3", successRate: 86.1, calls: 670 },
      { week: "W4", successRate: 86.9, calls: 689 },
    ],
    escalations: [
      { id: "ESC-102", type: "Reservations", reason: "Loyalty points not applied", time: "2h ago", status: "pending", agentTime: null },
      { id: "ESC-103", type: "Maintenance", reason: "Wi-Fi connectivity issue", time: "4h ago", status: "resolved", agentTime: 16 },
      { id: "ESC-104", type: "Billing", reason: "Parking charge dispute", time: "7h ago", status: "resolved", agentTime: 13 },
    ],
  },
];

export function getFleetKPIs() {
  const totalCalls = PROPERTIES.reduce((sum, p) => sum + p.totalCalls, 0);
  const revenueRecovered = PROPERTIES.reduce((sum, p) => sum + p.revenueRecovered, 0);
  const avgSuccessRate = (
    PROPERTIES.reduce((sum, p) => sum + p.successRate * p.totalCalls, 0) / totalCalls
  ).toFixed(1);
  const avgEscalation = (
    PROPERTIES.reduce((sum, p) => sum + p.escalationRate * p.totalCalls, 0) / totalCalls
  ).toFixed(1);

  return {
    successRate: parseFloat(avgSuccessRate),
    totalCalls,
    revenueRecovered,
    escalationRate: parseFloat(avgEscalation),
  };
}

export function getFleetRequestTypeBreakdown() {
  const types = ["Reservations", "Restaurant", "Maintenance", "Concierge", "Billing"];
  return types.map((type) => {
    let total = 0;
    let success = 0;
    let escalated = 0;
    PROPERTIES.forEach((p) => {
      const t = p.callsByType.find((c) => c.type === type);
      if (t) {
        total += t.total;
        success += t.success;
        escalated += t.escalated;
      }
    });
    return {
      type,
      total,
      success,
      escalated,
      successRate: parseFloat(((success / total) * 100).toFixed(1)),
    };
  });
}

export function getFleetFunnelData() {
  const total = PROPERTIES.reduce((sum, p) => sum + p.totalCalls, 0);
  const escalated = PROPERTIES.reduce((sum, p) =>
    sum + p.callsByType.reduce((s, t) => s + t.escalated, 0), 0);
  const humanResolved = Math.round(escalated * 0.78);
  const aiResolved = total - humanResolved;

  return [
    { label: "Total AI Requests",   value: total,         pct: 100,                                        color: "#3B82F6" },
    { label: "Escalated to Human",  value: escalated,     pct: Math.round((escalated / total) * 100),      color: "#F59E0B" },
    { label: "Human Resolved",      value: humanResolved, pct: Math.round((humanResolved / total) * 100),  color: "#F59E0B" },
    { label: "AI Fully Resolved",   value: aiResolved,    pct: Math.round((aiResolved / total) * 100),     color: "#10B981" },
  ];
}
