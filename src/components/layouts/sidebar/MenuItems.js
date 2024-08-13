import masterIcon from '../../../../public/images/database.svg';
import centerIcon from '../../../../public/images/centers.svg';
import dashboardIcon from '../../../../public/images/dashboard.svg';
import userIcon from '../../../../public/images/group.svg';
import coursePannerIcon from '../../../../public/images/event_available.svg';



// 


const Menuitems = [
  // {
  //   title: "SIDEBAR.DASHBOARD",
  //   icon: dashboardIcon,
  //   href: "/dashboard",
  // },
  {
    title: "SIDEBAR.CENTERS",
    icon: centerIcon,
    href: "/centers",
  },
  {
    title: "SIDEBAR.MANAGE_USERS",
    icon: userIcon,
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
    title: "Master ",
    icon: masterIcon,
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
    icon: coursePannerIcon,
    href: "/course-planner",
    subOptions: [
      {
        title: "SIDEBAR.FOUNDATION_COURSE",
        href: "/course-planner/foundation",
      },
      // {
      //   title: "SIDEBAR.MAIN_COURSE",
      //   href: "/mainCourse",
      // },
    ],
  },
];

export default Menuitems;
