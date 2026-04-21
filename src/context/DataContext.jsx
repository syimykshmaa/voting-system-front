import React, { createContext, useContext, useState } from "react";
import { ELECTIONS_DB, VOTES_DB, USERS_DB } from "../data/mockData";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [elections, setElections] = useState(ELECTIONS_DB);
  const [votes, setVotes] = useState(VOTES_DB);
  const [users, setUsers] = useState(USERS_DB);

  const createElection = (data, creatorId) => {
    const newElection = {
      id: Date.now(),
      ...data,
      status: "DRAFT",
      createdBy: creatorId,
      candidates: data.candidates || [],
    };
    setElections((prev) => [...prev, newElection]);
    return newElection;
  };

  const updateElection = (id, data) => {
    setElections((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  };

  const deleteElection = (id) => {
    setElections((prev) => prev.filter((e) => e.id !== id));
  };

  const castVote = (userId, electionId, candidateId) => {
    const alreadyVoted = votes.find((v) => v.userId === userId && v.electionId === electionId);
    if (alreadyVoted) throw new Error("You have already voted in this election");

    const election = elections.find((e) => e.id === electionId);
    if (!election || election.status !== "ACTIVE") throw new Error("Election is not active");

    const newVote = {
      id: Date.now(),
      userId,
      electionId,
      candidateId,
      timestamp: new Date().toISOString(),
    };
    setVotes((prev) => [...prev, newVote]);
    return newVote;
  };

  const hasVoted = (userId, electionId) => votes.some((v) => v.userId === userId && v.electionId === electionId);

  const getVotesForElection = (electionId) => votes.filter((v) => v.electionId === electionId);

  const getElectionResults = (electionId) => {
    const election = elections.find((e) => e.id === electionId);
    if (!election) return null;
    const electionVotes = getVotesForElection(electionId);
    const results = election.candidates.map((c) => ({
      ...c,
      voteCount: electionVotes.filter((v) => v.candidateId === c.id).length,
    }));
    return { election, results, totalVotes: electionVotes.length };
  };

  const addUser = (userData) => {
    const newUser = { id: Date.now(), ...userData, createdAt: new Date().toISOString().split("T")[0] };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const deleteUser = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));
  const updateUser = (id, data) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));

  return (
    <DataContext.Provider value={{
      elections, votes, users,
      createElection, updateElection, deleteElection,
      castVote, hasVoted, getVotesForElection, getElectionResults,
      addUser, deleteUser, updateUser,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
