# 📋 Plan: Simplify Product Entry & Handle Shelf Overflow (Nearby Suggestions)

This plan details how to implement a smart auto-fill feature for the "Add Product" form, along with an interactive "Nearby Location Suggestion" engine for when a target shelf/location is full.

---

## 🎯 Goal Description
1. **Category Autocomplete Dropdown:** Provide a dynamically populated autocomplete selection list of existing product categories on the "Add Product" form.
2. **Category-Based Location Auto-fill:** Once a category is typed or selected, analyze the existing database to find the most common location (Floor, Row, Shelf, Level) for that category and pre-fill the location coordinates automatically.
3. **Overflow / Nearby Shelf Suggestions:** If the suggested or selected shelf is physically full, dynamically display 3-4 adjacent alternative locations (e.g. next shelf, higher level, neighboring row) as clickable pills. Clicking a pill instantly updates the location fields.

---

## 🛠️ Proposed Changes

### 1. Stylesheet Updates: `public/css/styles.css`
Append custom utility styles for location suggestion pills:
```css
.loc-pill {
  font-family: var(--mono);
  font-size: 11px;
  background: var(--card-top-bg);
  border: 1px solid var(--line);
  color: var(--ink);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.loc-pill:hover {
  background: var(--ink);
  color: #ffffff;
  border-color: var(--ink);
}
```

---

### 2. Frontend Interface: `public/index.html`
* Add `<datalist id="categoryDatalist">` to the body.
* Bind the category input field `#fCategory` to `list="categoryDatalist"`.
* Append dynamic location suggestion containers in both the **Add Product** and **Product Details & Location** modals.

```html
<!-- Inside Add Product Modal -->
<div id="locSuggestions" class="loc-suggestions" style="margin-top: 8px; display: none;">
  <div class="hint" style="margin-bottom: 4px; font-size: 11px;">📍 Location full? Try nearby slots:</div>
  <div id="locSuggestionsPills" style="display: flex; gap: 6px; flex-wrap: wrap;"></div>
</div>

<!-- Inside Edit Product Modal -->
<div id="editLocSuggestions" class="loc-suggestions" style="margin-top: 8px; display: none;">
  <div class="hint" style="margin-bottom: 4px; font-size: 11px;">📍 Location full? Try nearby slots:</div>
  <div id="editLocSuggestionsPills" style="display: flex; gap: 6px; flex-wrap: wrap;"></div>
</div>
```

---

### 3. Application Logic: `public/js/app.js`
* Extract categories dynamically and populate `<datalist>`.
* Create `suggestLocationForCategory(catName)` mode-calculation helper.
* Create `getNearbyLocations(floor, row, shelf, level)` helper to return incremented/decremented coordinates.
* Hook events to `#fCategory` to trigger auto-fill.
* Hook events to Floor, Row, Shelf, and Level inputs to trigger alternative slot calculations and display the pills.

---

## 🔍 Verification Plan

### Manual Verification
1. Run the server using `npm start` (port 3002).
2. Click "Add Product". Focus "Category" and select a category. Floor, Row, Shelf, and Level should auto-populate.
3. Observe the "Location full? Try nearby slots" section. Click one of the options (e.g., `Shelf 02`). Verify that the shelf field changes to `02` and the suggestions list updates immediately.
4. Try modifying coordinates in the "Edit Details" modal and verify that the nearby suggestions change reactively.
