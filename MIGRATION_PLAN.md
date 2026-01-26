# Neo4j Frontend Migration Plan

## Overview

This is a complete rewrite of the API integration layer and related UI components for the backend migration from Postgres + Neo4j to Neo4j-only.

**Key decisions:**
- Big bang migration (no backwards compatibility)
- Database will be wiped (clean slate)
- Intentional simplification of tasting/rating structure
- New API spec is source of truth for enums and field names

---

## Phase 1: Foundation - Types & API Client

**Goal**: Establish the new data contracts and API communication layer.

### 1.1 Rewrite TypeScript Types
**File**: `lib/api/types.ts`

**Enums (source of truth from API spec):**
```typescript
type ProcessingMethod = 'washed' | 'natural' | 'honey' | 'anaerobic'
type RoastLevel = 'light' | 'medium' | 'medium_dark' | 'dark'
type BrewMethod = 'pourover' | 'espresso' | 'french_press' | 'aeropress' | 'cold_brew' | 'drip'
type GrindSize = 'fine' | 'medium_fine' | 'medium' | 'medium_coarse' | 'coarse'
```

**Entity Types:**
```typescript
type Roaster = { id, name, location?, website?, description?, created_at }
type Flavor = { id, name, category? }
type Coffee = { id, name, roaster, origin_country?, origin_region?, processing_method?, variety?, roast_level?, description?, flavors[], created_at }
type DetectedFlavor = { flavor: Flavor, intensity: number }
type Rating = { id, score, notes?, created_at }
type Tasting = { id, coffee, brew_method?, grind_size?, notes?, detected_flavors[], rating?, created_at }
type UserProfile = { id, email, first_name?, last_name?, display_name? }
type FlavorProfileEntry = { flavor: Flavor, count: number, avg_intensity: number }
type FlavorProfile = { total_tastings, top_flavors[], flavor_categories: Record<string, number> }
type SimilarCoffee = { coffee: Coffee, shared_flavors: string[], similarity_score: number }
type FlavorMatchCoffee = { coffee: Coffee, matching_flavors: string[], match_count: number }
```

### 1.2 Rewrite API Client
**File**: `lib/api/client.ts`

**Endpoints:**
```
# Roasters
GET/POST /roasters
GET/PATCH/DELETE /roasters/{id}

# Coffees
GET/POST /coffees
GET/PATCH/DELETE /coffees/{id}

# Flavors (renamed from flavor-tags)
GET/POST /flavors
GET /flavors/{id}

# Tastings (new structure)
GET/POST /tastings
GET/PATCH/DELETE /tastings/{id}

# Ratings (NEW - nested under tastings)
POST /tastings/{id}/rating
GET/PATCH/DELETE /tastings/{id}/rating

# User Profile (NEW)
GET/PATCH /me
GET /me/flavor-profile

# Recommendations (NEW)
GET /recommendations/similar/{coffee_id}
GET /recommendations/by-flavor?flavor_ids=x,y&exclude_tasted=bool
```

**Remove**: `syncGraphDatabase()` method

### 1.3 Update Query Keys
**File**: `lib/query-keys.ts`

**Add new key factories:**
```typescript
flavors: { all, lists, list, details, detail }
ratings: { all, detail: (tastingId) }
user: { profile, flavorProfile }
recommendations: { similar: (coffeeId), byFlavor: (flavorIds) }
```

---

## Phase 2: React Query Hooks

### 2.1 Roaster Hooks
**File**: `lib/queries/roasters.ts`
- Minor updates for response shape consistency
- Add `useRoaster(id)` if missing
- Add `useUpdateRoaster()`, `useDeleteRoaster()`

### 2.2 Coffee Hooks
**File**: `lib/queries/coffees.ts`
- Update for new `Coffee` type with nested `roaster` and `flavors[]`
- Update `useCreateCoffee()` to accept `flavor_ids`
- Update `useUpdateCoffee()` for new fields

### 2.3 Flavor Hooks
**File**: `lib/queries/flavors.ts` (new file)
- `useFlavors(category?)`
- `useFlavor(id)`
- `useCreateFlavor()`

### 2.4 Tasting Hooks
**File**: `lib/queries/tastings.ts`
- Complete rewrite for new `Tasting` type
- `useTastings(filters?)` - returns tastings with nested coffee, detected_flavors, rating
- `useTasting(id)`
- `useCreateTasting()` - accepts detected_flavors array
- `useUpdateTasting()`
- `useDeleteTasting()`

### 2.5 Rating Hooks (NEW)
**File**: `lib/queries/ratings.ts`
- `useRating(tastingId)`
- `useCreateRating(tastingId)`
- `useUpdateRating(tastingId)`
- `useDeleteRating(tastingId)`

### 2.6 User Hooks (NEW)
**File**: `lib/queries/user.ts`
- `useProfile()`
- `useUpdateProfile()`
- `useFlavorProfile()`

### 2.7 Recommendation Hooks (NEW)
**File**: `lib/queries/recommendations.ts`
- `useSimilarCoffees(coffeeId, limit?)`
- `useCoffeesByFlavor(flavorIds[], excludeTasted?)`

### 2.8 Remove Admin Hooks
**Delete**: `lib/queries/admin.ts`, `lib/queries/admin-queries.ts`

---

## Phase 3: Components

### 3.1 New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `FlavorPicker` | `components/FlavorPicker.tsx` | Multi-select flavors with intensity sliders |
| `FlavorIntensitySlider` | `components/FlavorIntensitySlider.tsx` | Individual flavor + intensity (1-10) |
| `RatingInput` | `components/RatingInput.tsx` | 1-5 star/score input |
| `RatingDisplay` | `components/RatingDisplay.tsx` | Display rating score |
| `SimilarCoffeesList` | `components/SimilarCoffeesList.tsx` | Show similar coffees with scores |
| `FlavorSearchForm` | `components/FlavorSearchForm.tsx` | Select flavors to find matching coffees |
| `FlavorProfileList` | `components/FlavorProfileList.tsx` | Simple list of user's flavor tendencies |
| `DetectedFlavorsList` | `components/DetectedFlavorsList.tsx` | Display detected flavors on tasting |
| `CoffeeFlavorTags` | `components/CoffeeFlavorTags.tsx` | Display expected flavors on coffee |

### 3.2 Components to Update

| Component | Changes |
|-----------|---------|
| `FlavorTag` | Keep as display component, update props if needed |
| `RecentTastingCard` | Update for new Tasting shape |
| `QuickStats` | Update queries/calculations |
| `DashboardContent` | Update for new data shapes |

### 3.3 Components to Remove

| Component | Reason |
|-----------|--------|
| `AdminGraphSyncButton` | Endpoint removed |

---

## Phase 4: Pages/Routes

### 4.1 New Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/profile` | `app/profile/page.tsx` | User profile + flavor profile |
| `/discover` | `app/discover/page.tsx` | Recommendations hub |
| `/discover/similar/[id]` | `app/discover/similar/[id]/page.tsx` | Similar coffees to specific coffee |
| `/discover/by-flavor` | `app/discover/by-flavor/page.tsx` | Search coffees by flavor |

### 4.2 Routes to Update

| Route | Changes |
|-------|---------|
| `/` (dashboard) | Update for new data, add "discover" prompts |
| `/coffees` | Show flavor tags on coffee cards |
| `/coffees/new` | Add flavor selection |
| `/coffees/[id]` | Show flavors, add "Find Similar" button |
| `/tastings` | Update for new tasting shape |
| `/tastings/new` | Simplify form, add detected flavors picker |
| `/tastings/[id]` | Show detected flavors, add/edit rating |
| `/roasters` | Minor updates if any |
| `/roasters/[id]` | Minor updates if any |

### 4.3 Navigation Updates
**Files**: `components/navigation.tsx`, `DesktopNavigation.tsx`, `MobileNavigation.tsx`

- Add Profile link (user menu)
- Add Discover section

---

## Phase 5: Implementation Order

Execute in this sequence to maintain a working app throughout:

### Step 1: Types & API Client
Foundation - nothing works without this.
- [ ] `lib/api/types.ts`
- [ ] `lib/api/client.ts`
- [ ] `lib/query-keys.ts`

### Step 2: Flavors
Dependency for coffees and tastings.
- [ ] `lib/queries/flavors.ts`
- [ ] `components/FlavorPicker.tsx`
- [ ] `components/FlavorIntensitySlider.tsx`

### Step 3: Roasters
Simple, few changes.
- [ ] `lib/queries/roasters.ts`
- [ ] `app/roasters/*` (minor updates)

### Step 4: Coffees
Depends on flavors.
- [ ] `lib/queries/coffees.ts`
- [ ] `components/CoffeeFlavorTags.tsx`
- [ ] `app/coffees/*` (update forms and displays)

### Step 5: Ratings
Needed for tastings.
- [ ] `lib/queries/ratings.ts`
- [ ] `components/RatingInput.tsx`
- [ ] `components/RatingDisplay.tsx`

### Step 6: Tastings
Depends on flavors, ratings.
- [ ] `lib/queries/tastings.ts`
- [ ] `components/DetectedFlavorsList.tsx`
- [ ] `app/tastings/*` (major updates)

### Step 7: User Profile
- [ ] `lib/queries/user.ts`
- [ ] `components/FlavorProfileList.tsx`
- [ ] `app/profile/page.tsx`

### Step 8: Recommendations
- [ ] `lib/queries/recommendations.ts`
- [ ] `components/SimilarCoffeesList.tsx`
- [ ] `components/FlavorSearchForm.tsx`
- [ ] `app/discover/*` (new pages)

### Step 9: Dashboard & Navigation
- [ ] `components/dashboard/*` (updates)
- [ ] `components/navigation.tsx` (add new links)
- [ ] Remove `AdminGraphSyncButton`

### Step 10: Cleanup
- [ ] Remove `lib/queries/admin.ts`
- [ ] Remove `lib/queries/admin-queries.ts`
- [ ] Remove unused types/code
- [ ] Update any remaining references

---

## File Change Summary

| Action | Count | Description |
|--------|-------|-------------|
| **Create** | ~15 | New components, hooks, pages |
| **Rewrite** | ~5 | types.ts, client.ts, tastings.ts, tasting pages |
| **Update** | ~15 | Existing components, hooks, pages |
| **Delete** | ~3 | Admin hooks, AdminGraphSyncButton |

---

## Notes

- **Styling**: Use existing Tailwind patterns
- **FlavorProfileChart**: Start with simple list, can enhance later
- **Pagination**: Maintain skip/limit pagination pattern
- **API terminology**: Use "Flavor" in API calls, "flavor tag" acceptable in UI labels
