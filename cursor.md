📌 Project Overview

This project is an Employee & Leave Management System with role-based access control (RBAC).

Current State

Backend: JavaScript

Frontend: Basic UI (not modern/professional)

Problem: Lacks vibrant, modern UI and role-based features.

Goal

Migrate backend to TypeScript (TS) for better type safety and maintainability.

Redesign UI to be professional, vibrant, and modern (dashboard-style, sidebar navigation).

Implement RBAC: SuperAdmin → Admins (with customizable powers/roles) → End Users.

👥 Roles & Permissions

SuperAdmin

Full access.

Can create new admins and other SuperAdmins.

Can assign roles/features to admins (not individual features but whole modules).

Modules to assign:

Writer

Company Commander

Duty Assign

Inventory

Mess/SO Commander

Admins (Sub Admins)

Can only access features/modules assigned by SuperAdmin.

Sidebar will only display their assigned modules.

Users (Employees)

Managed by Admins.

Limited interaction (mostly record keeping).

🖥️ Dashboard Design
Top-Level Options (Visible to all logged-in roles):

Dashboard → Summary view

Search/Browse Users

List all employees

Search functionality

Clicking on an employee row → Modal with tabbed details (Personal, Dates, Leave/Records, Bank).

Users (Add/Manage Employees)

Sidebar Modules (Role-based visibility):

Writer → Add new employee (form with all tabs & fields)

Inventory

Add item

Stock in

Stock out

View stock history

Duty Assign

Select date, personnel, duty, time

Only show available (not on leave) employees

Show duty assignments like a spreadsheet (rows with details)

Admins can create/update/delete duty types

Mess/SO Commander → Future module

📂 Employee Data Model
Basic Tab

SL NO

FORCE NO

RANK

NAME

MOBILE NO

STATE

RELIGION

CASTE

BG (Blood Group)

HOME ADDRESS

HEIGHT

DEPENDENT

NOK (Next of Kin)

ICARD NO

Dates Tab

DOA COY (Date of Arrival in Company)

DOA UNIT (Date of Arrival in Unit)

DOB (Date of Birth)

DOE (Date of Exit / Engagement)

DOP (Date of Promotion)

JD PET 1ST (Joining Date 1st Period)

JD PET 2ND (Joining Date 2nd Period)

Leave/Records Tab

Left Column:

EL DUE (Earned Leave Due)

CL DUE (Casual Leave Due)

COURSE

AME (Annual Medical Examination)

LTC (Leave Travel Concession)

PLN (Pension/Pay & Allowances)

SPL DUTY (Special Duty)

Right Column:

EL AVAILED

CL AVAILED

EDN (Education)

ARCF (Army Records)

PPPS (Pay, Pension, and Service)

SEC (Security clearance/Section)

Bank Details Tab

BANK ACCT (Account Number)

BR NAME (Branch Name)

IFSC CODE

MICR

🔑 Core Features

RBAC (Role-Based Access Control)

SuperAdmin → defines access (Writer, Duty Assign, Inventory, etc.)

Admins → see only assigned modules in sidebar.

Employee Management

Add employee with all tabs & details.

Search/filter employees.

View employee profile in modal (tabbed).

Leave & Availability

Select date → show employees on leave vs. available.

Used in Duty Assign logic.

Duty Assign

Assign duties to available employees.

Store duty type, date, time, personnel.

Spreadsheet-style list of assignments.

CRUD for duty types.

Inventory Management

Add items.

Stock in/out.

Track movement history.

🛠️ Tech Migration Plan



Define proper data models (e.g., Employee, Role, Duty, InventoryItem).



Employee, Duty, Inventory, Leave records, Bank details.