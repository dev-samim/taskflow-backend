# 📊 TaskFlow – Database Schema Documentation

This document explains the **MongoDB data model** used in **TaskFlow**, including collection structure, relationships, and design decisions. The schema is designed for **scalability, multi-tenancy, and advanced authorization**.

---

## 🧠 Design Principles

* **Multi-tenant by design** (organization-scoped data)
* **RBAC-first** authorization model
* **Auditability** for security & compliance
* **Scalable querying** with proper indexing
* **Soft extensibility** for future features

---

## 🏢 Organizations Collection

### Purpose

Represents a tenant (company / team) using TaskFlow.

### Schema

```ts
Organization {
  _id: ObjectId
  name: string
  plan: 'free' | 'pro' | 'enterprise'
  isActive: boolean
  createdAt: Date
}
```

### Notes

* Acts as the **root entity** for multi-tenancy
* All major entities are scoped by `orgId`

---

## 👤 Users Collection

### Purpose

Stores user identity, authentication, and organization mapping.

### Schema

```ts
User {
  _id: ObjectId
  email: string            // unique per organization
  password: string         // hashed
  orgId: ObjectId          // Organization reference
  roleId: ObjectId         // Role reference
  isActive: boolean
  lastLogin: Date
  createdAt: Date
}
```

### Indexes

* `email` (unique)
* `orgId`
* `roleId`

---

## 🛡️ Roles Collection

### Purpose

Defines roles and permissions for **advanced RBAC**.

### Schema

```ts
Role {
  _id: ObjectId
  name: string             // ADMIN, MANAGER, USER, CUSTOM
  permissions: string[]    // e.g. CREATE_TASK, DELETE_USER
  orgId: ObjectId
}
```

### Notes

* Roles are **organization-scoped**
* Enables custom roles per tenant

---

## ✅ Tasks Collection

### Purpose

Core business entity representing work items.

### Schema

```ts
Task {
  _id: ObjectId
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignedTo: ObjectId     // User reference
  createdBy: ObjectId     // User reference
  orgId: ObjectId
  dueDate: Date
  createdAt: Date
  updatedAt: Date
}
```

### Indexes

* `orgId`
* `assignedTo`
* `status + priority`

---

## 🧾 Activity Logs Collection

### Purpose

Tracks important actions for **auditing and observability**.

### Schema

```ts
ActivityLog {
  _id: ObjectId
  action: string           // TASK_CREATED, LOGIN, ROLE_CHANGED
  entityType: 'TASK' | 'USER'
  entityId: ObjectId
  performedBy: ObjectId    // User reference
  orgId: ObjectId
  timestamp: Date
}
```

### Use Cases

* Security auditing
* Debugging
* Admin dashboards

---

## 🔐 Refresh Tokens Collection

### Purpose

Secure session and refresh-token management.

### Schema

```ts
RefreshToken {
  _id: ObjectId
  userId: ObjectId
  token: string
  isRevoked: boolean
  expiresAt: Date
}
```

### Notes

* Works alongside **Redis token blacklist**
* Enables refresh token rotation

---

## 🔗 Relationships Summary

```txt
Organization 1 ──▶ Users
Organization 1 ──▶ Roles
Organization 1 ──▶ Tasks

Role 1 ──▶ Users
User 1 ──▶ Tasks
User 1 ──▶ ActivityLogs
User 1 ──▶ RefreshTokens
```

---

## 🚀 Scalability Considerations

* Organization-based partitioning
* Index-driven queries
* Cursor-based pagination
* Async writes via queues (for logs & notifications)

---

## 📌 Notes for Interview Discussion

You can confidently say:

> "The schema is designed around multi-tenancy and RBAC, with audit logging and token security built in from day one. It supports scale, security, and future extensibility."

---

