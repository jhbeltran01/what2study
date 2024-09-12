import classesIcon from '@assets/sidebar/classes.png';
import homeIcon from '@assets/sidebar/home.png';
import notesIcon from '@assets/sidebar/notes.png';
import reviewerIcon from '@assets/sidebar/reviewer.png';
import settingsIcon from '@assets/sidebar/settings.png';
import studypodIcon from '@assets/sidebar/studypod.png';

export const SidebarData = [
    {
        title: "Home",
        path: "/",
        icon: homeIcon,
    },
    {
        title: "Reviewers",
        path: "/reviewers",
        icon: reviewerIcon,
    },
    {
        title: "Notes",
        path: "/notes",
        icon: notesIcon,
    },
    {
        title: "Classes",
        path: "/classes",
        icon: classesIcon,
    },
    {
        title: "Study Pod",
        path: "/study-pod",
        icon: studypodIcon,
    },
    {
        title: "Settings",
        path: "/settings",
        icon: settingsIcon,
    },
    // Add more items as needed
];

export default SidebarData;