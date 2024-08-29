let state;

if (typeof window !== 'undefined') {
  state = localStorage.getItem('stateName');
}
const cardData = [
  {
    id: "1",
    state: state,
    boardsUploaded: 1,
    totalBoards: 1,
    details:
      "Maharashtra is a state in the southeastern coastal region of India.",
    boards: ["Maharashtra Board"],
    subjects: ["English"],
  },
];

export default cardData;
