---
description: How to configure which Dashboard a Role is redirected to (Doctor, Nurse, Reception)
---

# Configuring Role-Based Dashboard Access

The system now uses **Granular Permissions** to decide which dashboard a user sees when they log in. This allows you to create custom roles (e.g., "Senior Surgeon", "Triage Nurse") and assign them the correct dashboard view without changing code.

## Available Dashboard Permissions

There are 3 special permissions that control redirection:

1.  `hms:dashboard:doctor` -> **Doctor Dashboard**
2.  `hms:dashboard:nurse` -> **Nursing Station**
3.  `hms:dashboard:reception` -> **Reception Action Center**

## How to Set a Dashboard for a Role

1.  **Login** as an Administrator.
2.  Navigate to **Settings -> Roles & Permissions**.
3.  **Create** a new Role or **Edit** an existing one (e.g., "Head Physician").
4.  In the Permissions Grid, look for the **HMS** module (or "Dashboard Access" category).
5.  **Check** the box for the desired dashboard (e.g., "Access Doctor Dashboard").
6.  **Save** the Role.

## Effect

Any user assigned this role will now be automatically redirected to the selected dashboard upon login or when accessing the home page (`/`).

## Troubleshooting

*   **Multiple Dashboards?** If a role has multiple dashboard permissions (e.g., Doctor AND Nurse), the system checks in this order: Doctor > Nurse > Reception.
*   **No Dashboard?** If a user has no dashboard permissions, they will land on the default Home/Menu page.
