# Role-Based Access Control (RBAC) Implementation Documentation

## Overview

The role-based access control (RBAC) system is designed to manage user permissions based on their assigned roles. This system controls what features and functionalities different users can access within the application. The implementation consists of both backend (PHP/CodeIgniter) and frontend (React) components.

## Database Schema

The RBAC system uses the following database tables:

1. **roles** - Stores different user roles
   ```sql
   CREATE TABLE `roles` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `name` varchar(100) NOT NULL,
     `is_active` varchar(10) NOT NULL DEFAULT 'yes',
     `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (`id`)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
   ```

2. **permissions** - Stores individual permissions
   ```sql
   CREATE TABLE `permissions` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `name` varchar(100) NOT NULL,
     `short_code` varchar(100) NOT NULL,
     `is_active` int(11) DEFAULT '0',
     `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (`id`)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
   ```

3. **permission_category** - Groups permissions into categories
   ```sql
   CREATE TABLE `permission_category` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `perm_group_id` int(11) DEFAULT NULL,
     `name` varchar(100) DEFAULT NULL,
     `short_code` varchar(100) DEFAULT NULL,
     `enable_view` int(11) DEFAULT '0',
     `enable_add` int(11) DEFAULT '0',
     `enable_edit` int(11) DEFAULT '0',
     `enable_delete` int(11) DEFAULT '0',
     `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (`id`)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
   ```

4. **roles_permissions** - Maps roles to permissions
   ```sql
   CREATE TABLE `roles_permissions` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `role_id` int(11) DEFAULT NULL,
     `perm_cat_id` int(11) DEFAULT NULL,
     `can_view` int(11) DEFAULT NULL,
     `can_add` int(11) DEFAULT NULL,
     `can_edit` int(11) DEFAULT NULL,
     `can_delete` int(11) DEFAULT NULL,
     `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (`id`)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
   ```

5. **staff_roles** - Maps staff members to roles
   ```sql
   CREATE TABLE `staff_roles` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `role_id` int(11) DEFAULT NULL,
     `staff_id` int(11) DEFAULT NULL,
     `is_active` int(11) DEFAULT '0',
     `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     PRIMARY KEY (`id`),
     KEY `role_id` (`role_id`),
     KEY `staff_id` (`staff_id`)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
   ```

## Backend Implementation (PHP/CodeIgniter)

The backend implementation uses CodeIgniter's MVC architecture to handle RBAC functionality. Here's the complete PHP code for each component:

### 1. RBAC Library (application/libraries/Rbac.php)

```php
<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Rbac
{
    private $userRoles = array();
    protected $permissions;
    public $perm_category;

    public function __construct()
    {
        $this->CI = &get_instance();
        $this->permissions = array();
        $this->CI->config->load('mailsms');
        $this->perm_category = $this->CI->config->item('perm_category');
    }

    public function hasPrivilege($category = null, $permission = null)
    {
        $roles = $this->CI->customlib->getStaffRole();
        $logged_user_role = json_decode($roles)->name;

        if ($logged_user_role == 'Super Admin') {
            return true;
        }

        $admin = $this->CI->session->userdata('admin');
        $roles = $admin['roles'];
        $role_key = key($roles);
        $role_id = $roles[$role_key];

        $role_perm = $this->CI->rolepermission_model->getPermissionByRoleandCategory($role_id, trim($category));

        if ($role_perm) {
            if (array_key_exists($permission, $role_perm)) {
               return ($role_perm[$permission]);
            }
        }

        return false;
    }

    public function module_permission($module_name)
    {
        $module_perm = $this->CI->Module_model->getPermissionByModulename($module_name);
        return $module_perm;
    }
}
```

### 2. Role Model (application/models/Role_model.php)

```php
<?php
if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class Role_model extends MY_Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function get($id = null)
    {
        if ($this->session->has_userdata('admin')) {
            $getStaffRole = $this->customlib->getStaffRole();
            $staffrole = json_decode($getStaffRole);
            $superadmin_rest = $this->customlib->superadmin_visible();
            if ($superadmin_rest == 'disabled' && $staffrole->id != 7) {
                $this->db->where("roles.id !=", 7);
            }
        }

        $this->db->select()->from('roles');

        if ($id != null) {
            $this->db->where('roles.id', $id);
        } else {
            $this->db->order_by('roles.id');
        }

        $query = $this->db->get();
        if ($id != null) {
            return $query->row_array();
        } else {
            return $query->result_array();
        }
    }

    public function add($data)
    {
        $this->db->trans_start();
        $this->db->trans_strict(false);

        if (isset($data['id'])) {
            $this->db->where('id', $data['id']);
            $this->db->update('roles', $data);
            $message = UPDATE_RECORD_CONSTANT . " On roles id " . $data['id'];
            $action = "Update";
            $record_id = $data['id'];
            $this->log($message, $record_id, $action);

            $this->db->trans_complete();
            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                return false;
            } else {
                return true;
            }
        } else {
            $this->db->insert('roles', $data);
            $insert_id = $this->db->insert_id();
            $message = INSERT_RECORD_CONSTANT . " On roles id " . $insert_id;
            $action = "Insert";
            $record_id = $insert_id;
            $this->log($message, $record_id, $action);

            $this->db->trans_complete();
            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                return false;
            } else {
                return $insert_id;
            }
        }
    }

    public function getPermissions($group_id, $role_id)
    {
        $sql = "SELECT permission_category.*,IFNULL(roles_permissions.id,0) as `roles_permissions_id`,roles_permissions.can_view,roles_permissions.can_add,roles_permissions.can_edit,roles_permissions.can_delete FROM `permission_category` LEFT JOIN roles_permissions on permission_category.id = roles_permissions.perm_cat_id and roles_permissions.role_id= $role_id WHERE permission_category.perm_group_id = $group_id ORDER BY `permission_category`.`id`";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function count_roles($id)
    {
        $query = $this->db->select("*")->join("staff", "staff.id = staff_roles.staff_id")->where("staff_roles.role_id", $id)->where("staff.is_active", 1)->get("staff_roles");
        return $query->num_rows();
    }

    public function valid_check_exists($str)
    {
        $name = $this->input->post('name');
        $id = $this->input->post('id');

        if (!isset($id)) {
            $id = 0;
        }

        if ($this->check_exists($name, $id)) {
            $this->form_validation->set_message('check_exists', 'Record already exists');
            return FALSE;
        } else {
            return TRUE;
        }
    }

    public function check_exists($name, $id)
    {
        $this->db->where('name', $name);
        $this->db->where('id !=', $id);
        $query = $this->db->get('roles');

        if ($query->num_rows() > 0) {
            return TRUE;
        } else {
            return FALSE;
        }
    }
}
```

### 3. Role Permission Model (application/models/Rolepermission_model.php)

```php
<?php
if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class Rolepermission_model extends MY_Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getPermissionByRole($role_id)
    {
        $this->db->select('`roles_permissions`.*, permission_category.id as permission_category_id,permission_category.name as permission_category_name,permission_category.short_code as permission_category_code');
        $this->db->from('roles_permissions');
        $this->db->join('permission_category', 'permission_category.id=roles_permissions.perm_cat_id');
        $this->db->where('roles_permissions.role_id', $role_id);
        $query = $this->db->get();
        return $query->result();
    }

    public function getPermissionByRoleandCategory($role_id, $category)
    {
        $sql = "SELECT permission_category.*,roles_permissions.id as roles_permissions_id,roles_permissions.can_view,roles_permissions.can_add,roles_permissions.can_edit,roles_permissions.can_delete FROM permission_category INNER JOIN roles_permissions on permission_category.id = roles_permissions.perm_cat_id WHERE roles_permissions.role_id = " . $this->db->escape($role_id) . " AND permission_category.short_code = " . $this->db->escape($category) . " ORDER BY `permission_category`.`id`";
        $query = $this->db->query($sql);
        $result = $query->row();
        $permissions = array();
        if (!empty($result)) {
            $permissions = array(
                'can_view' => $result->can_view,
                'can_add' => $result->can_add,
                'can_edit' => $result->can_edit,
                'can_delete' => $result->can_delete
            );
        }
        return $permissions;
    }

    public function getInsertBatch($insert_array, $role_id, $delete_array)
    {
        $this->db->trans_start();
        $this->db->trans_strict(false);

        if (!empty($insert_array)) {
            $this->db->insert_batch('roles_permissions', $insert_array);
        }

        if (!empty($delete_array)) {
            $this->db->where('role_id', $role_id);
            $this->db->where_in('permission_id', $delete_array);
            $this->db->delete('role_permissions');
        }

        $this->db->trans_complete();

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            return false;
        } else {
            $this->db->trans_commit();
            return true;
        }
    }

    public function getPermissionWithSelectedByRole($role_id)
    {
        $sql = "SELECT permissions.*, role_permissions.id as `role_permission_id`,IF(role_permissions.id IS NULL,0,1) AS role_permission_state FROM `permissions` LEFT JOIN role_permissions on permissions.id=role_permissions.permission_id and role_permissions.role_id =$role_id";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function changeStatus($data)
    {
        $this->db->trans_start();
        $this->db->trans_strict(false);

        if ($data['status'] == "yes") {
            $this->db->where('id', $data['id']);
            $this->db->update('roles_permissions', array('is_active' => 0));
        } else {
            $this->db->where('id', $data['id']);
            $this->db->update('roles_permissions', array('is_active' => 1));
        }

        $this->db->trans_complete();

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            return false;
        } else {
            $this->db->trans_commit();
            return true;
        }
    }
}
```

### 4. Module Library (application/libraries/Module_lib.php)

```php
<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Module_lib
{
    private $allModules = array();
    protected $modules;
    var $perm_category;

    function __construct()
    {
        $this->CI = & get_instance();
        $this->modules = array();
        self::loadModule(); //Initiate the userroles
    }

    function loadModule()
    {
        $this->allModules = $this->CI->Module_model->get();

        if (!empty($this->allModules)) {
            foreach ($this->allModules as $mod_key => $mod_value) {
                if ($mod_value->is_active == 1) {
                    $this->modules[$mod_value->short_code] = true;
                } else {
                    $this->modules[$mod_value->short_code] = false;
                }
            }
        }
    }

    function hasActive($module = null)
    {
        if ($this->modules[$module]) {
            return true;
        }
        return false;
    }

    function hasModule($module = null)
    {
        if (array_key_exists($module, $this->modules)) {
            return true;
        }
        return false;
    }
}
```

### 5. Module Model (application/models/Module_model.php)

```php
<?php
if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class Module_model extends MY_Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function get()
    {
        $this->db->select('*')->from('modules');
        $this->db->order_by('modules.id');
        $query = $this->db->get();
        return $query->result();
    }

    public function getPermission()
    {
        $query = $this->db->where("system", 0)->get("permission_group");
        return $query->result_array();
    }

    public function getParentPermission()
    {
        $query = $this->db->where("system", 0)->get("permission_student");
        return $query->result_array();
    }

    public function getStudentPermission()
    {
        $query = $this->db->where("system", 0)->get("permission_student");
        return $query->result_array();
    }

    public function get_userpermission($role)
    {
        $this->db->select('permission_student.*');
        $this->db->from('permission_student');
        $query = $this->db->get();
        return $query->result();
    }

    public function getPermissionByModulename($module_name)
    {
        $sql = "SELECT permission_category.id,permission_category.name,permission_category.short_code,permission_category.enable_view,permission_category.enable_add,permission_category.enable_edit,permission_category.enable_delete FROM permission_category WHERE permission_category.short_code = " . $this->db->escape($module_name);
        $query = $this->db->query($sql);
        return $query->row();
    }

    public function changeStatus($data)
    {
        $this->db->trans_start();
        $this->db->trans_strict(false);

        if ($data['status'] == "yes") {
            $this->db->where('id', $data['id']);
            $this->db->update('modules', array('is_active' => 0));
        } else {
            $this->db->where('id', $data['id']);
            $this->db->update('modules', array('is_active' => 1));
        }

        $this->db->trans_complete();

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            return false;
        } else {
            $this->db->trans_commit();
            return true;
        }
    }
}
```

### 6. Auth Library (application/libraries/Auth.php)

```php
<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth
{
    public $CI;
    protected $errors = array();
    protected $messages = array();

    public function __construct()
    {
        $this->CI = &get_instance();
        $this->CI->load->model('staff_model');
    }

    public function check_admin_login()
    {
        if ($this->CI->session->has_userdata('admin')) {
            $admin = $this->CI->session->userdata('admin');
            $this->CI->load->model('staff_model');
            $result = $this->CI->staff_model->get($admin['id']);
            if ($result) {
                return true;
            } else {
                $this->CI->session->unset_userdata('admin');
                return false;
            }
        } else {
            return false;
        }
    }

    public function logged_in()
    {
        return (bool) $this->CI->session->userdata('admin');
    }

    public function is_logged_in($default_redirect = false)
    {
        $admin = $this->CI->session->userdata('admin');

        if (!$admin) {
            $_SESSION['redirect_to'] = current_url();
            redirect('site/login');
            return false;
        } else {
            $active_status = $this->CI->db->select('is_active')->from('staff')->where('id', $admin['id'])->get()->row_array();

            if ($active_status['is_active'] == 1) {
                if ($default_redirect) {
                    redirect('admin/admin/dashboard');
                }
                return true;
            } else {
                $_SESSION['redirect_to'] = current_url();
                $this->logout();
                redirect('site/login');
                return false;
            }
        }
    }

    public function logout()
    {
        delete_cookie('branch_cookie');
        $this->CI->session->unset_userdata('admin');
        $this->CI->session->sess_destroy();
    }

    public function addonchk($addon_name, $redirect_url = null)
    {
        $addon = $this->CI->db->select('*')->from('addons')->where('addon_name', $addon_name)->get()->row();
        if (!$addon) {
            if ($redirect_url) {
                redirect($redirect_url);
            }
            return false;
        }
        return true;
    }
}
```

### 7. Roles Controller (application/controllers/admin/Roles.php)

```php
<?php
if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class Roles extends Admin_Controller
{
    private $perm_category = array();

    public function __construct()
    {
        parent::__construct();
        $this->load->config('mailsms');
        $this->perm_category = $this->config->item('perm_category');
    }

    public function index()
    {
        if (!$this->rbac->hasPrivilege('superadmin', 'can_view')) {
            access_denied();
        }

        $data['title'] = 'Add Role';
        $this->session->set_userdata('top_menu', 'System Settings');
        $this->session->set_userdata('sub_menu', 'admin/roles');

        $this->form_validation->set_rules(
            'name', $this->lang->line('name'), array(
                'required',
                array('check_exists', array($this->role_model, 'valid_check_exists')),
            )
        );

        if ($this->form_validation->run() == FALSE) {
            $listroute = $this->role_model->get();
            $data['listroute'] = $listroute;
            $this->load->view('layout/header');
            $this->load->view('admin/roles/create', $data);
            $this->load->view('layout/footer');
        } else {
            $data = array(
                'name' => $this->input->post('name'),
                'is_active' => $this->input->post('is_active')
            );
            $this->role_model->add($data);
            $this->session->set_flashdata('msg', '<div class="alert alert-success text-left">' . $this->lang->line('success_message') . '</div>');
            redirect('admin/roles/index');
        }
    }

    public function permission($id)
    {
        $data['title'] = 'Add Role';
        $data['id'] = $id;
        $role = $this->role_model->get($id);
        $data['role'] = $role;
        $role_permission = $this->role_model->getPermission();
        $data['role_permission'] = $role_permission;

        $permissionCategory = $this->permissionCategory_model->get();
        $data['permissionCategory'] = $permissionCategory;

        $this->load->view('layout/header');
        $this->load->view('admin/roles/allotmodule', $data);
        $this->load->view('layout/footer');
    }

    public function edit($id)
    {
        $data['title'] = 'Edit Role';
        $data['id'] = $id;
        $editrole = $this->role_model->get($id);
        $data['editrole'] = $editrole;
        $data['name'] = $editrole["name"];
        $data['is_active'] = $editrole["is_active"];

        $this->form_validation->set_rules(
            'name', $this->lang->line('name'), array(
                'required',
                array('check_exists', array($this->role_model, 'valid_check_exists')),
            )
        );

        if ($this->form_validation->run() == FALSE) {
            $listroute = $this->role_model->get();
            $data['listroute'] = $listroute;
            $this->load->view('layout/header');
            $this->load->view('admin/roles/edit', $data);
            $this->load->view('layout/footer');
        } else {
            $data = array(
                'id' => $id,
                'name' => $this->input->post('name'),
                'is_active' => $this->input->post('is_active')
            );
            $this->role_model->add($data);
            $this->session->set_flashdata('msg', '<div class="alert alert-success text-left">' . $this->lang->line('update_message') . '</div>');
            redirect('admin/roles/index');
        }
    }

    public function delete($id)
    {
        $data['title'] = 'Roles List';
        $this->role_model->remove($id);
        redirect('admin/roles/index');
    }

    public function module_permission($id)
    {
        if (!$this->rbac->hasPrivilege('superadmin', 'can_view')) {
            access_denied();
        }

        $this->form_validation->set_rules('role_id', $this->lang->line('role'), 'trim|required|xss_clean');

        if ($this->form_validation->run() == FALSE) {
            $data = array();
            $role = $this->role_model->get($id);
            $data['title'] = 'Module Permission';
            $data['id'] = $id;
            $data['role'] = $role;
            $data['permissions'] = $this->perm_category;
            $rolePermission = $this->role_model->getPermissionByRole($id);
            $data['role_permission'] = $rolePermission;

            $permissionCategory = $this->Permission_model->getPermissionCategory();
            $data['permissionCategory'] = $permissionCategory;

            $this->load->view('layout/header');
            $this->load->view('admin/roles/module_permission', $data);
            $this->load->view('layout/footer');
        } else {
            $role_id = $this->input->post('role_id');
            $module_perm = $this->input->post('module_perm');

            if (!isset($module_perm)) {
                $module_perm = array();
            }

            $this->role_model->getInsertBatch($module_perm, $role_id);
            $this->session->set_flashdata('msg', '<div class="alert alert-success text-left">' . $this->lang->line('update_message') . '</div>');
            redirect('admin/roles/module_permission/' . $id);
        }
    }
}
```

## Frontend Implementation (React)

The frontend implementation uses React to create a modern, component-based UI for the RBAC system:

1. **AuthContext Provider**: Manages authentication state and permission checking
2. **Protected Routes**: Restricts access to routes based on user permissions
3. **Permission Guards**: Conditionally renders components based on user permissions
4. **Dynamic Sidebar**: Shows menu items based on user permissions
5. **User Management**: Interface for managing users and their roles
6. **Role Management**: Interface for creating and managing roles
7. **Permission Management**: Interface for assigning permissions to roles

## Key Components

### 1. AuthContext Provider

```jsx
// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  // Check if user has a specific permission
  const hasPermission = (category, permission) => {
    if (userRoles.includes('Super Admin')) return true;

    return userPermissions &&
           userPermissions[category] &&
           userPermissions[category][permission];
  };

  // Value to be provided by the context
  const value = {
    user,
    userRoles,
    userPermissions,
    loading,
    hasPermission,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### 2. Protected Route Component

```jsx
// src/components/ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ component: Component, category, permission, ...rest }) => {
  const { user, loading, hasPermission } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) return <Redirect to="/login" />;
        if (category && permission && !hasPermission(category, permission)) {
          return <Redirect to="/unauthorized" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};
```

### 3. Sidebar Menu Component

```jsx
// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Sidebar = () => {
  const { hasPermission } = useAuth();
  const [menuItems, setMenuItems] = useState([]);

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter(menuItem =>
    menuItem.permissions.some(perm =>
      hasPermission(perm.category, perm.permission)
    )
  );

  return (
    <aside className="main-sidebar">
      <section className="sidebar">
        <ul className="sidebar-menu">
          {filteredMenuItems.map(menuItem => (
            <li key={menuItem.id}>
              {/* Menu item rendering logic */}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};
```

## API Endpoints

The following API endpoints are required for the RBAC system:

1. **Authentication Endpoints**:
   - `POST /api/auth/login` - User login
   - `POST /api/auth/logout` - User logout
   - `GET /api/auth/user` - Get current user info
   - `GET /api/auth/roles` - Get user roles
   - `GET /api/auth/permissions` - Get user permissions

2. **Role Management Endpoints**:
   - `GET /api/admin/roles` - Get all roles
   - `GET /api/admin/roles/{id}` - Get role by ID
   - `POST /api/admin/roles` - Create new role
   - `PUT /api/admin/roles/{id}` - Update role
   - `DELETE /api/admin/roles/{id}` - Delete role

3. **Permission Management Endpoints**:
   - `GET /api/admin/permission-groups` - Get all permission groups with categories
   - `GET /api/admin/roles/{id}/permissions` - Get permissions for a role
   - `POST /api/admin/roles/{id}/permissions` - Update permissions for a role

4. **User Management Endpoints**:
   - `GET /api/admin/users` - Get all users
   - `GET /api/admin/users/{id}` - Get user by ID
   - `POST /api/admin/users` - Create new user
   - `PUT /api/admin/users/{id}` - Update user
   - `DELETE /api/admin/users/{id}` - Delete user

5. **Menu Management Endpoints**:
   - `GET /api/menu/sidebar` - Get sidebar menu items based on user permissions

## Integration Steps

To implement this RBAC system in your application:

1. **Set up the database tables** using the provided SQL schema
2. **Implement the backend components** in your CodeIgniter application
3. **Create the API endpoints** to handle RBAC operations
4. **Implement the React frontend components** for user interface
5. **Configure authentication** to work with both backend and frontend
6. **Test the system** thoroughly to ensure permissions are enforced correctly

## Conclusion

This RBAC implementation provides a comprehensive solution for managing user access in your application. By separating roles from permissions and using a component-based approach, the system is both flexible and maintainable. Users will only see and access the features they have permission for, enhancing security and user experience.

## Implementation Best Practices

1. **Role Hierarchy**: Consider implementing a role hierarchy where higher-level roles inherit permissions from lower-level roles.

2. **Caching Permissions**: Cache user permissions after login to avoid repeated database queries.

3. **Audit Logging**: Implement audit logging to track permission changes and access attempts.

4. **Regular Reviews**: Regularly review and audit role assignments and permissions to ensure they remain appropriate.

5. **Principle of Least Privilege**: Assign users the minimum permissions necessary to perform their job functions.

6. **Testing**: Thoroughly test permission changes before deploying to production.

## Example Usage

### Checking Permissions in React Components

```jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { hasPermission } = useAuth();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Only show if user has permission */}
      {hasPermission('student', 'can_view') && (
        <div className="student-stats">
          <h2>Student Statistics</h2>
          {/* Student statistics content */}
        </div>
      )}

      {/* Only show if user has permission */}
      {hasPermission('finance', 'can_view') && (
        <div className="financial-stats">
          <h2>Financial Statistics</h2>
          {/* Financial statistics content */}
        </div>
      )}
    </div>
  );
};
```

### Checking Permissions in Backend Controllers

```php
public function viewStudents()
{
    // Check if user has permission to view students
    if (!$this->rbac->hasPrivilege('student', 'can_view')) {
        access_denied();
    }

    // User has permission, proceed with the action
    $data['students'] = $this->student_model->get();
    $this->load->view('students/index', $data);
}
```

## Troubleshooting

1. **Permission Not Working**: Ensure the permission is correctly assigned to the role and the user is assigned to that role.

2. **Menu Items Not Showing**: Check that the menu item has the correct permission category and permission type.

3. **Access Denied Errors**: Verify that the user's role has the necessary permissions for the action they're trying to perform.

4. **React Components Not Rendering**: Ensure the `hasPermission` function is being called correctly and the permission category and type match what's in the database.



