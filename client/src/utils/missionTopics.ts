export interface MissionTopic {
  id: number;
  topic: string;
}

export const MISSION_TOPICS: MissionTopic[] = [
  { id: 1, topic: "Will AI replace teachers in the future?" },
  { id: 2, topic: "Is remote work better than office work?" },
  { id: 3, topic: "Should students use AI for learning?" },
  { id: 4, topic: "What makes a good leader?" },
  { id: 5, topic: "Is social media helpful or harmful?" },
  { id: 6, topic: "Should college education be free?" },
  { id: 7, topic: "What is the best way to learn English?" },
  { id: 8, topic: "Will electric vehicles replace petrol cars?" },
  { id: 9, topic: "Is technology making people less social?" },
  { id: 10, topic: "What makes a successful career?" },
  { id: 11, topic: "Should everyone learn programming?" },
  { id: 12, topic: "Is traveling important for personal growth?" },
  { id: 13, topic: "What skills will be important in the future?" },
  { id: 14, topic: "Should companies use a four-day work week?" },
  { id: 15, topic: "Can AI improve education?" },
];

export const MISSION_DURATION_MINUTES = 5;

export function getRandomMissionTopic(): MissionTopic {
  const index = Math.floor(Math.random() * MISSION_TOPICS.length);
  return MISSION_TOPICS[index];
}
