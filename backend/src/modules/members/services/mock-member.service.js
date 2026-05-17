/**
 * Mock JEA member directory until the real member API is integrated.
 * Keys are engineering membership numbers (engineeringId).
 */

const MOCK_MEMBERS = {
  "100001": {
    engineeringId: "100001",
    memberName: "أحمد الخطيب",
    memberSpecialty: "مدني",
    membershipStatus: "active",
  },
  "100002": {
    engineeringId: "100002",
    memberName: "سارة النجار",
    memberSpecialty: "معمارية",
    membershipStatus: "active",
  },
  "100003": {
    engineeringId: "100003",
    memberName: "محمد العمري",
    memberSpecialty: "كهرباء",
    membershipStatus: "suspended",
  },
};

/**
 * @param {string} engineeringId
 * @returns {{ found: boolean, active: boolean, member?: object }}
 */
function verifyMemberByEngineeringId(engineeringId) {
  const normalized = String(engineeringId || "").trim();

  if (!normalized) {
    return { found: false, active: false };
  }

  const member = MOCK_MEMBERS[normalized];

  if (!member) {
    return { found: false, active: false };
  }

  return {
    found: true,
    active: member.membershipStatus === "active",
    member,
  };
}

module.exports = {
  MOCK_MEMBERS,
  verifyMemberByEngineeringId,
};
