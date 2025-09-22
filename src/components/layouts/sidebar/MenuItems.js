import masterIcon from "../../../../public/images/database.svg";
import centerIcon from "../../../../public/images/centers.svg";
import dashboardIcon from "../../../../public/images/dashboard.svg";
import userIcon from "../../../../public/images/group.svg";
import coursePannerIcon from "../../../../public/images/event_available.svg";
import approvalIcon from "../../../../public/images/approval.svg";
const ENV = process.env.NEXT_PUBLIC_SHOW_WORKSPACE;

//

const Menuitems = [
  {
    title: "SIDEBAR.TENANT",
    icon: dashboardIcon,
    href: "/tenant",
  },
  {
    title: "COHORTS.COHORTS",
    icon: centerIcon,
    href: "/cohorts",
  },
  {
    title: "SIDEBAR.MANAGE_USERS",
    icon: userIcon,
    //  href: "/",
    subOptions: [
      // {
      //   title: "SIDEBAR.TEAM_LEADERS",
      //   href: "/team-leader",
      // },
      // {
      //   title: "SIDEBAR.FACILITATORS",
      //   href: "/faciliator",
      // },
      {
        title: "SIDEBAR.LEARNERS",
        href: "/learners",
      },
    ],
  },
  {
    title: "SIDEBAR.APPROVAL_STATUS",
    icon: approvalIcon,
    href: "/approval-status",
    roles: ["tenant_admin", "cohort_admin", "super_admin"], // Visible to tenant admins and super admins
  },
  {
    title: "SIDEBAR.ADMIN_APPROVALS",
    icon: approvalIcon,
    href: "/admin-approvals",
    roles: ["super_admin"], // Only visible to super admins
  },

  // {
  //   title: "Master ",
  //   icon: masterIcon,
  //   // href: "/",
  //   subOptions: [
  //     {
  //       title: "MASTER.STATE",
  //       href: "/state",
  //     },
  //     {
  //       title: "MASTER.DISTRICTS",
  //       href: "/district",
  //     },
  //     {
  //       title: "MASTER.BLOCKS",
  //       href: "/block",
  //     },
  //   ],
  // },
  // {
  //   title: "SIDEBAR.COURSE_PLANNER",
  //   icon: coursePannerIcon,
  //   href: "/course-planner",
  // },
  // ...(ENV === 'true'
  //   ? [
  //       {
  //         title: "SIDEBAR.WORKSPACE",
  //         icon: dashboardIcon,
  //         href: "/workspace/content/create",
  //       },
  //     ]
  //   : []),
];

export default Menuitems;
