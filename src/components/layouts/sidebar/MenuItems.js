import masterIcon from '../../../../public/images/database.svg';
import centerIcon from '../../../../public/images/centers.svg';
import dashboardIcon from '../../../../public/images/dashboard.svg';
import userIcon from '../../../../public/images/group.svg';
import coursePannerIcon from '../../../../public/images/event_available.svg';
const isEditorUrlDefined = typeof process.env.REMOTE_EDITOR_URL !== 'undefined';


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
        href: "/team-leader",
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
        title: "MASTER.STATE",
        href: "/state",
      },
      {
        title: "MASTER.DISTRICTS",
        href: "/district",
      },
      {
        title: "MASTER.BLOCKS",
        href: "/block",
      },
    ],
  },
  {
    title: "SIDEBAR.COURSE_PLANNER",
    icon: coursePannerIcon,
    href: "/course-planner",
  },
  ...(isEditorUrlDefined
    ? [
        {
          title: "SIDEBAR.WORKSPACE",
          icon: dashboardIcon,
          href: "/workspace/content/create",
        },
      ]
    : []),
];

export default Menuitems;
