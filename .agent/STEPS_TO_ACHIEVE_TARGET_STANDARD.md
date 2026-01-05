
# World-Standard Target Achievement Logic: "Gated Performance Progression"

In high-performance sales organizations (like Salesforce, Oracle, or SaaS unicors), targets are not just a single "end-of-month" number. They are broken down into **Leading Indicators** (Inputs) and **Lagging Indicators** (Outputs).

To "block" a user effectively based on steps, we treat the Target Period relative to a **Milestone Roadmap**.

## The Logic: The "3-Gate" System

Instead of blocking a user only at the end of the month (when it's too late), we place **Gates** at intervals.

### Step 1: The Activity Gate (Input)
*   **Timeframe**: First 25% of the Period (e.g., Week 1 of Month).
*   **Requirement**: "Pipeline Velocity". User must log X Calls or Create Y Leads.
*   **Blocking Condition**: If Activity < 80% of Goal by Week 1.
*   **Block Type**: "Soft Block" (Warning visible on dashboard, Manager notified).

### Step 2: The Pipeline Gate (Throughput)
*   **Timeframe**: 50% of the Period (e.g., Mid-Month).
*   **Requirement**: "Pipeline Coverage". User must have Open Deals value = 3x of Revenue Target.
*   **Blocking Condition**: If Pipeline < 3x Target.
*   **Block Type**: "Hard Restriction". User cannot Create *New* Deals until they fix existing pipeline quality (e.g., move deals to qualified).

### Step 3: The Revenue Gate (Output)
*   **Timeframe**: 100% of Period (End of Month).
*   **Requirement**: Revenue Target Hit.
*   **Blocking Condition**: If Revenue < Target.
*   **Block Type**: "Compliance Block". User account locked or Commission withheld.

---

## Technical Implementation Plan

We will upgrade the `crm_targets` system to support **Milestones**.

### 1. Database Schema Update
We need to store these steps. We will add a `crm_target_milestones` table.

```prisma
model crm_target_milestones {
  id String @id @default(uuid())
  target_id String // Relates to the main Monthly Goal
  
  step_order Int // 1, 2, 3
  name String // e.g. "Week 1 Activity Sprint"
  
  metric_type String // "calls", "deals_created", "pipeline_value", "revenue"
  target_value Decimal 
  
  deadline DateTime // When this step must be completed
  
  is_blocking Boolean @default(true) // If true, failing this blocks the user
  
  achieved_value Decimal @default(0)
  status String @default("pending") // pending, passed, failed
}
```

### 2. Visualization
The Dashboard will show a "Progress Bar" with Checkpoints.
`[Target Start] ----(Gate 1)----(Gate 2)----(Goal)---|`

### 3. Automation
The compliance script will run daily. instead of just checking `revenue` vs `target` at the end, it checks:
`Is Today > Milestone.deadline?`
  `If Yes AND Milestone.achieved < Milestone.target:`
    ` BLOCK USER.`

## Recommendation
I will implement this Schema and update the Logic to support "Multi-Step Targets". This gives you the control you asked for: **Blocking users at specific steps if requirements aren't met.**
