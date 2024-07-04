

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
        href: "/teamLeader",
      },
      {
        title: "SIDEBAR.FACILITATORS",
        href: "/faciliator",
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
        href: "/createPlan",
      },
      {
        title: "SIDEBAR.VIEW_PLANS",
        href: "/viewPlans",
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
