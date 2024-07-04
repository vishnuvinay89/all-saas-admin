

const Menuitems = [
  {
    title: "SIDEBAR.DASHBOARD",
    icon: "home",
    href: "/",
  },
  {
    title: "SIDEBAR.MANAGE_USERS",
    icon: "user",
    href: "/",
    subOptions: [
      {
        title: "SIDEBAR.TEAM_LEADERS",
        href: "/team-leaders",
      },
      {
        title: "SIDEBAR.FACILITATORS",
        href: "/Faciliator",
      },
      {
        title: "SIDEBAR.LEARNERS",
        href: "/learners",
      },
      
    ],
  },
  {
    title: "SIDEBAR.COURSE_PLANNER",
    icon: "calendar",
    href: "/course-planner",
    subOptions: [
      {
        title: "SIDEBAR.CREATE_PLAN",
        href: "/create",
      },
      {
        title: "SIDEBAR.VIEW_PLANS",
        href: "/view-plans",
      },
    ],
  },
  {
    title: "SIDEBAR.COHORTS",
    icon: "users",
    href: "/cohorts",
  },
];

export default Menuitems;
