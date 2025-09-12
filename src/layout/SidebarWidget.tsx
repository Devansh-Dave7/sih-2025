import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/auth";

const getRoleBasedWidgetContent = (role: UserRole) => {
  switch (role) {
    case 'student':
      return {
        title: "Student Portal",
        description: "Access your academic records, assignments, and hostel information.",
        buttonText: "View Grades"
      };
    case 'admin':
      return {
        title: "Admin Panel",
        description: "Manage system settings, users, and administrative functions.",
        buttonText: "System Settings"
      };
    case 'clerk':
      return {
        title: "Clerk Dashboard",
        description: "Handle student records, fees, and administrative tasks.",
        buttonText: "Manage Records"
      };
    case 'hostel-warden':
      return {
        title: "Hostel Management",
        description: "Manage hostel operations, room assignments, and student welfare.",
        buttonText: "Room Management"
      };
    default:
      return {
        title: "Dashboard",
        description: "Welcome to your personalized dashboard.",
        buttonText: "Get Started"
      };
  }
};

export default function SidebarWidget() {
  const { user } = useAuth();
  const content = user ? getRoleBasedWidgetContent(user.role) : getRoleBasedWidgetContent('student');
  
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        {content.title}
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        {content.description}
      </p>
      <button
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 w-full"
      >
        {content.buttonText}
      </button>
    </div>
  );
}
