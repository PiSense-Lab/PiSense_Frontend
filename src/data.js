const DATA = [
  {
    id: 1,
    name: "Weather Station A",
    type: "Weather",
    data: [
      {
        date: "2026-03-01",
        temperature: "15°C",
        humidity: "80%",
        windSpeed: "12 km/h",
      },
      {
        date: "2026-03-02",
        temperature: "17°C",
        humidity: "75%",
        windSpeed: "10 km/h",
      },
      {
        date: "2026-03-03",
        temperature: "16°C",
        humidity: "78%",
        windSpeed: "15 km/h",
      },
      {
        date: "2026-03-04",
        temperature: "14°C",
        humidity: "82%",
        windSpeed: "9 km/h",
      },
      {
        date: "2026-03-05",
        temperature: "18°C",
        humidity: "70%",
        windSpeed: "14 km/h",
      },
      {
        date: "2026-03-06",
        temperature: "20°C",
        humidity: "65%",
        windSpeed: "13 km/h",
      },
      {
        date: "2026-03-07",
        temperature: "19°C",
        humidity: "68%",
        windSpeed: "11 km/h",
      },
      {
        date: "2026-03-08",
        temperature: "21°C",
        humidity: "60%",
        windSpeed: "10 km/h",
      },
      {
        date: "2026-03-09",
        temperature: "22°C",
        humidity: "62%",
        windSpeed: "12 km/h",
      },
      {
        date: "2026-03-10",
        temperature: "23°C",
        humidity: "58%",
        windSpeed: "15 km/h",
      },
    ],
  },
  {
    id: 2,
    name: "Battery Pack 04 Test",
    type: "Battery",
    data: [
      { time: "00:00", voltage: "3.7V", current: "1.2A", temp: "25°C" },
      { time: "01:00", voltage: "3.6V", current: "1.1A", temp: "26°C" },
      { time: "02:00", voltage: "3.5V", current: "1.0A", temp: "25°C" },
      { time: "03:00", voltage: "3.7V", current: "1.3A", temp: "27°C" },
      { time: "04:00", voltage: "3.6V", current: "1.2A", temp: "26°C" },
      { time: "05:00", voltage: "3.5V", current: "1.1A", temp: "25°C" },
      { time: "06:00", voltage: "3.7V", current: "1.2A", temp: "26°C" },
      { time: "07:00", voltage: "3.6V", current: "1.3A", temp: "27°C" },
      { time: "08:00", voltage: "3.5V", current: "1.0A", temp: "25°C" },
      { time: "09:00", voltage: "3.7V", current: "1.1A", temp: "26°C" },
    ],
  },
  {
    id: 4,
    name: "Solar Grid Analysis",
    type: "Energy",
    data: [
      { panelId: "P-01", voltage: "32V", current: "5A", efficiency: "85%" },
      { panelId: "P-02", voltage: "31V", current: "4.8A", efficiency: "83%" },
      { panelId: "P-03", voltage: "33V", current: "5.2A", efficiency: "86%" },
      { panelId: "P-04", voltage: "32V", current: "5A", efficiency: "84%" },
      { panelId: "P-05", voltage: "31V", current: "4.9A", efficiency: "82%" },
      { panelId: "P-06", voltage: "33V", current: "5.1A", efficiency: "85%" },
      { panelId: "P-07", voltage: "32V", current: "5A", efficiency: "83%" },
      { panelId: "P-08", voltage: "31V", current: "4.8A", efficiency: "82%" },
    ],
  },
];

export default DATA;
