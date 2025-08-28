# IoT Device Management – Backend Design Notes

## Approach

I set out by first thinking about what entities are involved and asking some upfront questions that helped shape the model and approach:

- **What is a valid ID?** Should we use UUIDs? What patterns are acceptable? Went with DB autoincrement ID for the purpose of the task.
- **Do we need config history?**
  - If no → store config inline with the device.
  - If yes → separate `DeviceConfig` table linked to device, store all configs, with a bit column to mark the active config.
  - In the end kept the DeviceConfig table but assumed no config history.
- **Status: standard or vendor-specific?**
  - If statuses are standardised → use an enum.
  - If vendors differ and statuses change regularly → use a `DeviceState` table to allow add/update/delete.
  - Would add tables for statuses and the like with static data but left out for the purpose of this task.
- **Age-based features?** → Should we store DOB? Any **PII security considerations**?

I thought about the bigger picture rather than just the immediate deliverables. This allowed me to design entities in a way that makes the system easier to extend in the future.

Once I had the conceptual model, I:

1. **Scaffolded the project** with initial structure.
2. **Set a pattern** for routes, controllers, and services.
3. Built out the first set of routes and then layered additional routes on top.
4. Made adjustments along the way as new requirements and edge cases became clear.

---

## Device Model Rationale

The `Device` table is supported by three related tables that separate configuration, state, and history:

### 1. `DeviceConfig` – Desired Configuration

- Stores the **latest config settings** (JSON) for each device.
- One row per device.
- Represents the **intended or desired state** (e.g., “thermostat target = 21°C”).
- Updated via **PUT requests** when a user changes configuration.

### 2. `DeviceState` – Actual Status

- Tracks **real-time operational data** (is it online? current temp? brightness?).
- Reflects what the device is doing **right now**, which may not match the config.
- Updated by telemetry from devices, background sync jobs, or events.
- Routes not implemented for this task

### 3. `DeviceEvent` – Event History

- Append-only log of events.
- Captures what happened to a device over time (offline events, firmware updates, config changes).
- Useful for auditing, debugging, analytics.
- Routes not implemented for this task

This separation is deliberate:

- `DeviceConfig` = **What should the device be doing?**
- `DeviceState` = **What is the device doing now?**
- `DeviceEvent` = **What has the device done in the past?**

---

## Challenges

- **ESM vs CommonJS**
  - Initially tried to go fully **ESM (Node 16+)** but hit config issues with TypeScript and Jest.
  - Jest in particular had issues with ESM.
  - To keep momentum, I reverted to **CommonJS**, which simplified testing and avoided overcomplication.

- **ORM Choice**
  - Initially tried **Sequelize** (familiarity), but ran into friction.
  - Switched to **Prisma**, which I had some exposure to.
  - This turned out to be beneficial, as I deepened my understanding of Prisma.

- **Balancing priorities**
  - The task coincided with a **bank holiday weekend** and **school holidays**.
  - I balanced delivering the core functionality with exploring extensions for a bigger-picture design.
  - In hindsight, I could have covered the **minimum deliverables first** and then layered on enhancements. This would have freed more time to complete the **UI stretch goal**.

---

## Future Improvements

- **Docker Compose** setup to include:
  - API service
  - SQL Server container
  - Possibly Prisma Studio for inspection  
    → This would smooth out setup for other devs.

- **Config history**: optional enhancement if future requirements demand auditing of past configs.

- **UI**: Delivering the stretch goal frontend would complete the end-to-end flow.

## Github Copilot Usage

- openapi yaml
- jsdoc annotations
- readme and summary support
- debug support when required
