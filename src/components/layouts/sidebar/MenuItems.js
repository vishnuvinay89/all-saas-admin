const Menuitems = [
  {
    title: "SIDEBAR.DASHBOARD",
    icon: "home",
    href: "/dashboard",
  },
  {
    title: "SIDEBAR.MANAGE_USERS",
    icon: "user",
    //  href: "/",
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
    title: "SIDEBAR.COHORTS",
    icon: "users",
    href: "/cohorts",
  },

  {
    title: "Master ",
    icon: "database",
    // href: "/",
    subOptions: [
      {
        title: "State",
        href: "/state",
      },
      {
        title: "District",
        href: "/district",
      },
      {
        title: "Block",
        href: "/block",
      },
    ],
  },
  {
    title: "SIDEBAR.COURSE_PLANNER",
    icon: "calendar",
    href: "/course-planner",
    subOptions: [
      {
        title: "SIDEBAR.FOUNDATION_COURSE",
        href: "/course-planner/foundation",
      },
      {
        title: "SIDEBAR.MAIN_COURSE",
        href: "/mainCourse",
      },
    ],
  },
];

export default Menuitems;
