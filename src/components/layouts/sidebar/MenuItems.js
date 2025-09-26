import masterIcon from "../../../../public/images/database.svg";
import centerIcon from "../../../../public/images/centers.svg";
import dashboardIcon from "../../../../public/images/dashboard.svg";
import userIcon from "../../../../public/images/group.svg";
import coursePannerIcon from "../../../../public/images/event_available.svg";
import approvalIcon from "../../../../public/images/approval.svg";
const ENV = process.env.NEXT_PUBLIC_SHOW_WORKSPACE;

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
    subOptions: [
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
    roles: ["tenant_admin", "cohort_admin"],
  },
  {
    title: "SIDEBAR.ADMIN_APPROVALS",
    icon: approvalIcon,
    href: "/admin-approvals",
    roles: ["super_admin"],
  },
];

export default Menuitems;
