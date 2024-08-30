let state;

if (typeof window !== 'undefined') {
  state = 'Maharashtra'
}
const cardData = [
  {
    id: "1",
    state: state,
    boardsUploaded: 0,
    totalBoards: 1,
    details:
      "Maharashtra is a state in the southeastern coastal region of India.",
    boards: ["Maharashtra Board"],
    subjects: ["English"],
  },
];

export default cardData;
