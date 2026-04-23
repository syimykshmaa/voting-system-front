import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { currentUser, token } = useAuth();

  const [elections, setElections] = useState([]);
  const [votes, setVotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const [electionsRes, votesRes] = await Promise.all([
        apiClient.get("/elections"),
        apiClient.get("/votes"),
      ]);

      setElections(electionsRes);
      setVotes(votesRes);

      if (currentUser?.role === "ADMIN") {
        const usersRes = await apiClient.get("/users");
        setUsers(usersRes);
      } else {
        setUsers(currentUser ? [currentUser] : []);
      }
    } catch (err) {
      console.error("Failed to load data", err);
      setElections([]);
      setVotes([]);
      setUsers(currentUser ? [currentUser] : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setElections([]);
      setVotes([]);
      setUsers([]);
      return;
    }
    loadAll();
  }, [token, currentUser?.id, currentUser?.role]);

  const createElection = async (data) => {
    const created = await apiClient.post("/elections", data);
    setElections((prev) => [created, ...prev]);
    return created;
  };

  const updateElection = async (id, data) => {
    const updated = await apiClient.put(`/elections/${id}`, data);
    setElections((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteElection = async (id) => {
    await apiClient.delete(`/elections/${id}`);
    setElections((prev) => prev.filter((e) => e.id !== id));
    setVotes((prev) => prev.filter((v) => v.electionId !== id));
  };

  const castVote = async (userId, electionId, candidateId) => {
    const vote = await apiClient.post("/votes", { userId, electionId, candidateId });
    setVotes((prev) => [vote, ...prev]);
    return vote;
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

  const addUser = async (userData) => {
    const newUser = await apiClient.post("/users", userData);
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const deleteUser = async (id) => {
    await apiClient.delete(`/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setVotes((prev) => prev.filter((v) => v.userId !== id));
  };

  const updateUser = async (id, data) => {
    const updated = await apiClient.put(`/users/${id}`, data);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  };

  return (
    <DataContext.Provider
      value={{
        elections,
        votes,
        users,
        loading,
        reload: loadAll,
        createElection,
        updateElection,
        deleteElection,
        castVote,
        hasVoted,
        getVotesForElection,
        getElectionResults,
        addUser,
        deleteUser,
        updateUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
