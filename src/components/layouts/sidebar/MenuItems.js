
import { useTranslation } from "next-i18next";

const Menuitems = [
  {
    title: "SIDEBAR.DASHBOARD",
    icon: "home",
    href: "/",
  },
  {
    title: "SIDEBAR.MANAGE_USERS",
    icon: "user",
    href: "/manage-users",
    subOptions: [
      {
        title: "SIDEBAR.TEAM_LEADERS",
        href: "/manage-users",
      },
      {
        title: "SIDEBAR.FACILITATORS",
        href: "/manage-users",
      },
      {
        title: "SIDEBAR.LEARNERS",
        href: "/manage-users",
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
        href: "/course-planner",
      },
      {
        title: "SIDEBAR.VIEW_PLANS",
        href: "/manage-users",
      },
    ],
  },
  {
    title: "Cohorts",
    icon: "users",
    href: "/cohorts",
  },
];

export default Menuitems;
