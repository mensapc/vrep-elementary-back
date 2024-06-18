interface Staff {
  id: string;
  name: string;
  // Add other staff properties if needed
}

interface TimetableEntry {
  staff: Staff;
  day: string;
  start_time: string;
  end_time: string;
  course: string;
}

interface TimetableDataEntry {
  _id: {
    start_time: string;
  };
  entries: {
    day: string;
    // Add other entry properties if needed
  }[];
}
import Timetable from "../database/models/timetable";

export async function generateTimetable(
  staff: Staff
): Promise<TimetableEntry[]> {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
  ];

  const timetableEntries: TimetableEntry[] = [];
  for (const day of days) {
    for (let i = 0; i < hours.length - 1; i++) {
      const startHour = hours[i];
      const endHour = hours[i + 1];

      const newEntry: TimetableEntry = {
        staff,
        day,
        start_time: startHour,
        end_time: endHour,
        course: "",
      };
      await Timetable.create(newEntry);
      timetableEntries.push(newEntry);
    }
  }
  return timetableEntries;
}

export function formatTimetableData(
  data: TimetableDataEntry[]
): TimetableDataEntry[] {
  return data
    .map((entry) => {
      const { start_time } = entry._id;
      const formattedEntry: TimetableDataEntry = {
        _id: { start_time },
        entries: entry.entries
          .sort((a, b) => {
            if (a.day === b.day) {
              return 0;
            }
            const days = [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ];
            return days.indexOf(a.day) - days.indexOf(b.day);
          })
          .map((data) => data),
      };
      return formattedEntry;
    })
    .sort((a, b) => {
      const timeA = a._id.start_time.split(":").map(Number);
      const timeB = b._id.start_time.split(":").map(Number);
      if (timeA[0] !== timeB[0]) {
        return timeA[0] - timeB[0];
      }
      return timeA[1] - timeB[1];
    });
}
