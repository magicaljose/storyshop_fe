import DashboardPage from "views/Dashboard/Dashboard.jsx";
import Seasons from "views/Dashboard/seasons.jsx";
import WorldPage from "views/Dashboard/World.jsx";
import MainPad from "views/Dashboard/MainPad";
import SeasonView from "views/Dashboard/SeasonView";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import Login from "views/LoginSignup/Login.jsx";
import SignUp from "views/LoginSignup/Signup.jsx";
import Logout from "views/LoginSignup/Logout.jsx";
import ForgotPassword from "views/LoginSignup/ForgotPassword.jsx";
import ResetPassword from "views/LoginSignup/ResetPassword.jsx";
import TableList from "views/TableList/TableList.jsx";
import GetUserContent from "views/Dashboard/GetUserContent";
import TearupComonCard from "views/Dashboard/CardsPop/TearupComonCard";
import TearupCharacterCard from "views/Dashboard/CardsPop/TearupCharacterCard";
// import Typography from "views/Typography/Typography.jsx";
// import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import ChapterScene from "views/Dashboard/PortalChapterScene.jsx";
// import NotificationsPage from "views/Notifications/Notifications.jsx";
import BookPublish from "views/Dashboard/BookPublish.jsx";
import BookData from "views/Dashboard/BookData.jsx";

import HandleUser from "views/LoginSignup/HandleUser.jsx";

import {
    Dashboard, Person, ContentPaste, LibraryBooks, BubbleChart, LocationOn, Notifications
} from 'material-ui-icons';

const appRoutes = [
  { path: "/app", sidebarName: "Dashboard", navbarName: "Material Dashboard", icon: Dashboard, component: HandleUser },
  { path: "/dashboard", sidebarName: "Dashboard", navbarName: "Material Dashboard", icon: Dashboard, component: DashboardPage },
  { path: "/admin/authorized/:user_email", component: GetUserContent },
  { path: "/:world_id/seasons", sidebarName: "Dashboard", navbarName: "Material Dashboard", icon: Dashboard, component: Seasons },
  { path: "/:access_key/:world_id/seasons", sidebarName: "Dashboard", navbarName: "Material Dashboard", icon: Dashboard, component: Seasons },
  { path: "/World", sidebarName: "Dashboard", navbarName: "Material Dashboard", icon: Dashboard, component: WorldPage },
  { path: "/:world_id/new-season", sidebarName: "Dashboard", navbarName: "Material Dashboard", icon: Dashboard, component: MainPad },
  { path: "/:world_id/:series_id/:season_id", exact:true, sidebarName: "Dashboard", navbarName: "Material Dashboard", icon: Dashboard, component: MainPad },
  { path: "/:access_key/:world_id/:series_id/:season_id", exact:true, sidebarName: "Dashboard", navbarName: "Material Dashboard", icon: Dashboard, component: MainPad },
  { path: "/login", sidebarName: "Dashboard", navbarName: "Material Dashboard", icon: Dashboard, component: Login },
  { path: "/user", sidebarName: "User Profile", navbarName: "Profile", icon: Person, component: UserProfile },
  { path: "/scene-:scene_id/:season_id/chapter-:episode_id", component: ChapterScene },
  { path: "/chapter-:episode_id/:season_id", component: ChapterScene },
  { path: "/portalbuilder/:builder_id", component: TearupCharacterCard },
  { path: "/portalbuilder-cards/:builder_id", component: TearupComonCard },
  { path: "/dashboard/book-publish", component: BookPublish },
  { path: "/dashboard/book-data", component: BookData },
  { path: "/logout", component: Logout },
 
  { redirect: true, path: "/", to: "/login", navbarName: "Redirect" }
  
];

export default appRoutes;
