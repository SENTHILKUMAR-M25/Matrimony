import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const segmentLabels = {
  'admin': 'Dashboard',
  'users': 'Users',
  'profile-approvals': 'Profile Approvals',
  'communities': 'Communities',
  'subscriptions': 'Subscriptions',
  'matches': 'Matches',
  'reports': 'Reports & Support',
  'settings': 'Settings',
  'profile': 'Admin Profile',
};

const formatSegment = (segment) => {
  if (segmentLabels[segment]) return segmentLabels[segment];
  return segment
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AdminBreadcrumbs = ({ pathname }) => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    return { label: formatSegment(segment), href, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center min-w-0">
      <ol className="flex items-center gap-1 text-sm text-gray-500 min-w-0">
        <li className="hidden sm:flex items-center gap-1 min-w-0">
          {crumbs.length > 1 ? (
            <Link to="/admin" className="flex items-center gap-1 text-gray-400 hover:text-pink-600 transition-colors flex-shrink-0">
              <Home size={14} />
            </Link>
          ) : (
            <Home size={14} className="text-gray-400 flex-shrink-0" />
          )}
        </li>
        {crumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            <ChevronRight size={12} className="text-gray-300 flex-shrink-0 hidden sm:block" />
            <li className="min-w-0 hidden sm:block">
              {crumb.isLast ? (
                <span className="text-pink-700 font-medium truncate block" title={crumb.label}>
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.href}
                  className="text-gray-500 hover:text-pink-600 transition-colors truncate block"
                  title={crumb.label}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
            {crumb.isLast && (
              <>
                <ChevronRight size={12} className="text-gray-300 flex-shrink-0 sm:hidden" />
                <li className="min-w-0 sm:hidden">
                  <span className="text-pink-700 font-medium truncate block text-xs" title={crumb.label}>
                    {crumb.label}
                  </span>
                </li>
              </>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default AdminBreadcrumbs;
