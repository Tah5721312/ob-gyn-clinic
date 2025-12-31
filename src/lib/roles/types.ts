// lib/roles/types.ts

export interface RoleListItem {
  id: number;
  roleName: string;
  roleCode: string;
  description: string | null;
  isActive: boolean;
  permissionsCount: number;
  usersCount: number;
}

export interface PermissionListItem {
  id: number;
  permissionName: string;
  permissionCode: string;
  description: string | null;
  module: string | null;
  isActive: boolean;
}

export interface RoleFilters {
  search?: string;
  isActive?: boolean;
}

export interface PermissionFilters {
  search?: string;
  module?: string;
  isActive?: boolean;
}

export interface CreateRoleData {
  roleName: string;
  roleCode: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateRoleData {
  roleName?: string;
  roleCode?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreatePermissionData {
  permissionName: string;
  permissionCode: string;
  description?: string;
  module?: string;
  isActive?: boolean;
}

export interface UpdatePermissionData {
  permissionName?: string;
  permissionCode?: string;
  description?: string;
  module?: string;
  isActive?: boolean;
}

export interface AssignPermissionData {
  roleId: number;
  permissionId: number;
  grantedBy?: number;
}

