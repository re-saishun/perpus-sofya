# ToramDB Skill Tree Data Guide

This guide explains how to add or edit skill data for the Skill Simulator.

## 1. Data File

All skill tree data lives in **`js/skill-simulator-data.js`**.

This file defines `window.skillTrees` — an array of tree objects.
A backup/database copy also exists in `beta/skill_simulator_data.js` (Google Sheet source).

## 2. Skill Tree Structure

Each tree object:

```javascript
{
  id: "blade",              // Unique ID
  label: "Blade Skills",    // Display name
  width: 980,               // Canvas width (px)
  height: 730,              // Canvas height (px)
  icon: "./icons/skills/sk_sword_mastery.png",
  visible: true,            // false = hidden (e.g. Event Skills)
  star_gem_visible: true,
  skills: [ ... ]           // Array of skill objects
}
```

## 3. Skill Object Structure

| Property | Description | Example |
| :--- | :--- | :--- |
| **id** | Unique skill ID | `"hard_hit"` |
| **name** | Display name | `"Hard Hit"` |
| **level** | Starting level (always `0`) | `0` |
| **x** | Horizontal position (px) | `100` |
| **y** | Vertical position (px) | `160` |
| **prerequisites** | Array of skill IDs (must be Lv.5) | `["sword_mastery"]` |
| **star_gem_available** | Can use Star Gem? | `true` |
| **star_gem_cost** | Star Gem cost | `1` |
| **star_gem_level** | Default Star Gem level | `1` |
| **star_gem_selected** | Default selected? (always `false`) | `false` |

## 4. Positioning Guide

The simulator uses a pixel coordinate system (X, Y) relative to the top-left of the tree.

- **Horizontal (X)**: Spacing ~120px between columns.
  - Col 1: `x: 100`, Col 2: `x: 220`, Col 3: `x: 340`
- **Vertical (Y)**: Spacing ~120px between rows.
  - Row 1: `y: 40`, Row 2: `y: 160`, Row 3: `y: 280`

> [!TIP]
> Height is automatically calculated from the highest Y value + 60px padding. You only need to set `height` if you want extra space.

## 5. Connection Lines

Lines are drawn automatically from `prerequisites`.

- **Direction**: Vertical first (↓), then Horizontal (→) — matching the beta simulator.
- **Style**: Cyan `#00FFFF` (inactive), Gold `#FFD700` (active/highlighted).
- If both nodes share the same X or Y, a straight line is drawn instead.

## 6. How to Add a New Skill

1. Open `js/skill-simulator-data.js`
2. Find the correct tree by `id`
3. Add a new skill object to the `skills` array:

```javascript
{
  id: "new_skill",
  name: "New Skill",
  level: 0,
  star_gem_available: false,
  star_gem_cost: 0,
  star_gem_level: 1,
  star_gem_selected: false,
  x: 340,
  y: 280,
  prerequisites: ["parent_skill_id"],
},
```

4. Commit and push to `main` branch → GitHub Pages auto-deploys.

## 7. Hiding a Skill Tree

Set `visible: false` on the tree object. Example: Event Skills are hidden this way.

## 8. Future: Auto-Sync from Google Sheet

The `SkillTrees` tab in the Google Sheet can be used as a database.
When GitHub Actions permissions are configured (`Settings → Actions → Read and write permissions`), the pipeline can auto-generate `js/skill-simulator-data.js` from the Sheet.
