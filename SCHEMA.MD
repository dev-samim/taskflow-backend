# 📊 TaskFlow – Database Schema Documentation

This document explains the **MongoDB data model** used in **TaskFlow**, including collection structure, relationships, and key design decisions. The schema is intentionally designed for **scalable multi-tenancy, clean RBAC, and auditability**, following real-world SaaS patterns.

---

## 🧠 Design Principles

* **True multi-tenancy** (organization-scoped data, shared users)
* **Separation of concerns** (identity vs membership vs authorization)
* **RBAC-first** authorization model
* **Auditability** for security & compliance
* **Scalable querying** with proper indexing
* **Future-proof extensibility** (invites, multi-org users, enterprise plans)

---

## 🏢 Organizations Collection

### Purpose

Represents a tenant (company / team) using TaskFlow.

### Schema

```ts
Organization {
  _id: ObjectId
  name: string
  slug: string            // unique, URL-safe identifier
  plan: 'free' | 'pro' | 'enterprise'
  isActive: boolean
  createdAt: Date
}
```

### Notes

* Root entity for multi-tenancy
* All business data is scoped via `orgId`
* `slug` is generated on the backend and used for routing

---

## 👤 Users Collection (Global Identity)

### Purpose

Stores **user identity and authentication data only**. Users are **not directly tied to organizations or roles**.

### Schema

```ts
User {
  _id: ObjectId
  email: string            // globally unique
  password: string         // hashed
  isActive: boolean
  lastLogin: Date
  createdAt: Date
}
```

### Indexes

* `email` (unique)

### Notes

* A single user can belong to **multiple organizations**
* Authorization is handled via organization membership

---

## 🧩 OrganizationMembers Collection

### Purpose

Acts as the **link between users, organizations, and roles**. This collection enables true multi-tenancy and per-organization RBAC.

### Schema

```ts
OrganizationMember {
  _id: ObjectId
  userId: ObjectId         // User reference
  orgId: ObjectId          // Organization reference
  roleId: ObjectId         // Role reference
  status: 'INVITED' | 'ACTIVE' | 'REMOVED'
  joinedAt: Date
}
```

### Indexes

* `userId + orgId` (unique)
* `orgId`
* `roleId`

### Notes

* A user can have **different roles in different organizations**
* Enables org invites, role changes, and membership lifecycle

---

## 🛡️ Roles Collection

### Purpose

Defines roles and permissions for **role-based access control (RBAC)**. Roles are **organization-scoped**.

### Schema

```ts
Role {
  _id: ObjectId
  name: string             // OWNER, ADMIN, MEMBER, CUSTOM
  permissions: string[]    // e.g. task:create, member:invite
  orgId: ObjectId
}
```

### Notes

* Each organization can define custom roles
* Default roles are auto-created during organization setup

---

## ✅ Tasks Collection

### Purpose

Core business entity representing work items within an organization.

### Schema

```ts
Task {
  _id: ObjectId
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignedTo: ObjectId     // User reference
  createdBy: ObjectId      // User reference
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

Tracks important system actions for **auditing, security, and observability**.

### Schema

```ts
ActivityLog {
  _id: ObjectId
  action: string           // TASK_CREATED, LOGIN, ROLE_CHANGED
  entityType: 'TASK' | 'USER' | 'ORG'
  entityId: ObjectId
  performedBy: ObjectId    // User reference
  orgId: ObjectId
  timestamp: Date
}
```

### Use Cases

* Security audits
* Debugging & traceability
* Admin activity timelines

---

## 🔐 Refresh Tokens Collection

### Purpose

Manages refresh tokens for secure session handling and token rotation.

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

* Works alongside Redis token blacklist
* Supports logout and refresh token rotation

---

## 🔗 Relationships Summary

```txt
Organization 1 ──▶ OrganizationMembers
Organization 1 ──▶ Roles
Organization 1 ──▶ Tasks

User 1 ──▶ OrganizationMembers
Role 1 ──▶ OrganizationMembers

User 1 ──▶ Tasks
User 1 ──▶ ActivityLogs
User 1 ──▶ RefreshTokens
```

---

## 🚀 Scalability Considerations

* Organization-based data isolation
* Proper compound indexing
* Cursor-based pagination for large datasets
* Async writes via queues for logs & notifications

---
