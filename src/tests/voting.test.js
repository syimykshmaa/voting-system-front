// VoteChain - Basic Unit Tests

describe("Authentication Logic", () => {
  const USERS = [
    { id: 1, username: "admin", password: "admin123", role: "ADMIN" },
    { id: 2, username: "user1", password: "pass123", role: "USER" },
  ];

  const login = (username, password) => {
    const user = USERS.find(u => u.username === username && u.password === password);
    if (!user) throw new Error("Invalid credentials");
    return user;
  };

  test("login with correct credentials returns user", () => {
    const user = login("admin", "admin123");
    expect(user.username).toBe("admin");
    expect(user.role).toBe("ADMIN");
  });

  test("login with wrong password throws error", () => {
    expect(() => login("admin", "wrong")).toThrow("Invalid credentials");
  });

  test("login with unknown user throws error", () => {
    expect(() => login("ghost", "pass")).toThrow("Invalid credentials");
  });
});

describe("JWT Token Simulation", () => {
  const generateToken = (user) => {
    const payload = { id: user.id, role: user.role, exp: Date.now() + 3600000 };
    return btoa(JSON.stringify(payload));
  };

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) return null;
      return payload;
    } catch {
      return null;
    }
  };

  test("token encodes and decodes correctly", () => {
    const user = { id: 1, role: "ADMIN" };
    const token = generateToken(user);
    const decoded = decodeToken(token);
    expect(decoded.id).toBe(1);
    expect(decoded.role).toBe("ADMIN");
  });

  test("expired token returns null", () => {
    const payload = { id: 1, role: "USER", exp: Date.now() - 1000 };
    const token = btoa(JSON.stringify(payload));
    expect(decodeToken(token)).toBeNull();
  });

  test("invalid token returns null", () => {
    expect(decodeToken("invalid_token")).toBeNull();
  });
});

describe("Voting Logic", () => {
  let votes = [];

  const castVote = (userId, electionId, candidateId) => {
    const alreadyVoted = votes.find(v => v.userId === userId && v.electionId === electionId);
    if (alreadyVoted) throw new Error("Already voted");
    const vote = { id: Date.now(), userId, electionId, candidateId, timestamp: new Date().toISOString() };
    votes.push(vote);
    return vote;
  };

  const hasVoted = (userId, electionId) => votes.some(v => v.userId === userId && v.electionId === electionId);

  beforeEach(() => { votes = []; });

  test("user can cast a vote", () => {
    const vote = castVote(1, 1, 2);
    expect(vote.userId).toBe(1);
    expect(vote.electionId).toBe(1);
    expect(vote.candidateId).toBe(2);
  });

  test("user cannot vote twice in same election", () => {
    castVote(1, 1, 2);
    expect(() => castVote(1, 1, 3)).toThrow("Already voted");
  });

  test("user can vote in different elections", () => {
    castVote(1, 1, 2);
    const vote2 = castVote(1, 2, 5);
    expect(vote2.electionId).toBe(2);
  });

  test("hasVoted returns true after voting", () => {
    castVote(1, 1, 2);
    expect(hasVoted(1, 1)).toBe(true);
  });

  test("hasVoted returns false before voting", () => {
    expect(hasVoted(1, 1)).toBe(false);
  });
});

describe("Election Results", () => {
  const getResults = (election, votes) => {
    const electionVotes = votes.filter(v => v.electionId === election.id);
    const results = election.candidates.map(c => ({
      ...c,
      voteCount: electionVotes.filter(v => v.candidateId === c.id).length,
    }));
    return { results, totalVotes: electionVotes.length };
  };

  const election = {
    id: 1,
    candidates: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }, { id: 3, name: "Charlie" }],
  };

  test("counts votes correctly per candidate", () => {
    const votes = [
      { electionId: 1, candidateId: 1 },
      { electionId: 1, candidateId: 1 },
      { electionId: 1, candidateId: 2 },
    ];
    const { results, totalVotes } = getResults(election, votes);
    expect(results[0].voteCount).toBe(2);
    expect(results[1].voteCount).toBe(1);
    expect(results[2].voteCount).toBe(0);
    expect(totalVotes).toBe(3);
  });

  test("returns zero votes when no votes cast", () => {
    const { results, totalVotes } = getResults(election, []);
    results.forEach(r => expect(r.voteCount).toBe(0));
    expect(totalVotes).toBe(0);
  });
});

describe("Role-Based Access Control", () => {
  const hasAccess = (userRole, requiredRoles) => requiredRoles.includes(userRole);

  test("ADMIN can access admin pages", () => {
    expect(hasAccess("ADMIN", ["ADMIN"])).toBe(true);
  });

  test("USER cannot access admin-only pages", () => {
    expect(hasAccess("USER", ["ADMIN"])).toBe(false);
  });

  test("MANAGER can access shared pages", () => {
    expect(hasAccess("MANAGER", ["ADMIN", "MANAGER"])).toBe(true);
  });

  test("all roles can access public pages", () => {
    ["ADMIN", "MANAGER", "USER"].forEach(role => {
      expect(hasAccess(role, ["ADMIN", "MANAGER", "USER"])).toBe(true);
    });
  });
});
