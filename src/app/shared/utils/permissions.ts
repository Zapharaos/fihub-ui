/**
 * Matches a permission pattern against a permission string.
 * @param pattern The permission pattern to match against.
 * @param permission The permission string to check.
 */
export function matchPermission(pattern: string, permission: string): boolean {
  if (pattern === "*") {
    return true;
  }

  // Escape special characters in the pattern
  pattern = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  // Replace wildcard (*) with a regex-friendly wildcard (.*)
  pattern = pattern.replace(/\\\*/g, '.*');

  // Compile the regular expression
  const regex = new RegExp(`^${pattern}$`);

  // Check if the permission matches the compiled regex
  return regex.test(permission);
}

/**
 * Checks if the user has the specified permission(s).
 * @param permission The permission(s) to check. (string or string array)
 * @param tempPermissions The user's permissions.
 */
export function hasPermissions(permission: string | string[], tempPermissions: Set<string>): boolean {
  // First handle array of permissions
  if (Array.isArray(permission)) {
    let matchedPermissions = 0;

    for (const p of permission) {
      for (const tempPermission of tempPermissions) {
        if (matchPermission(tempPermission, p)) {
          matchedPermissions++;
          break; // Break to avoid counting the same permission multiple times
        }
      }
    }
    return matchedPermissions === permission.length;
  }

  // Handle single permission
  for (const tempPermission of tempPermissions) {
    if (matchPermission(tempPermission, permission)) {
      return true;
    }
  }

  return false;
}
