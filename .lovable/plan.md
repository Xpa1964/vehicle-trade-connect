

## Block B — Code Cleanup Plan

### Summary of findings

| Task | File to delete/modify | References found | Action needed |
|------|----------------------|-----------------|---------------|
| B1 | `src/pages/Dashboard.tsx`, `src/pages/DashboardNew.tsx` | Routes already import `DashboardMainPage` directly (line 65). No imports reference these files. | Safe to delete both |
| B2 | `src/pages/MessagesOptimized.tsx` | Referenced by `src/components/messages/MessagesContainer.tsx`, but `MessagesContainer` itself is not imported anywhere. | Delete both `MessagesOptimized.tsx` and `MessagesContainer.tsx` |
| B3 | `src/pages/VehiclePreviewPageOptimized.tsx` | No imports found. Routes use `VehiclePreviewPage` (not Optimized). | Safe to delete |
| B4 | `src/pages/DirectoryWithChat.tsx` | No imports found. Admin uses `AdminDirectoryChat`. | Safe to delete |
| B5 | `src/hooks/useVehicleFilterData.tsx` | 3 consumers import from `@/hooks/useVehicleFilterData` (no extension). Vite resolves `.tsx` before `.ts`. Must update imports to explicitly use `.ts` or delete `.tsx` so `.ts` resolves. | Delete `.tsx`, verify resolution |
| B6 | `src/components/layouts/AdminLayout.tsx` | Imported in `src/routes/AppRoutes.tsx` line 6. Must update to `@/components/layout/AdminLayout`. | Update import, delete file |
| B7 | `src/components/debug/ImageDiagnostic.tsx` | No imports found. | Safe to delete |
| B8 | `ImageUploadTester` in `VehicleManagement.tsx` | Lines 108-118. Wrap entire debug tab content in dev check. | Wrap with `process.env.NODE_ENV === 'development'` |
| B9 | `react-toastify` | In `package.json` only. Zero code imports found. | Remove from package.json |
| B10 | `disputeService.ts`, `disputeNotificationService.ts` | No consumer imports found. | Add disabled comment header |

### Detailed changes

**B1** — Delete `src/pages/Dashboard.tsx` and `src/pages/DashboardNew.tsx`. No import updates needed (AppRoutes line 65 already points to `DashboardMainPage`).

**B2** — Delete `src/pages/MessagesOptimized.tsx` and `src/components/messages/MessagesContainer.tsx` (orphaned wrapper with zero imports).

**B3** — Delete `src/pages/VehiclePreviewPageOptimized.tsx`.

**B4** — Delete `src/pages/DirectoryWithChat.tsx`.

**B5** — Delete `src/hooks/useVehicleFilterData.tsx`. The 3 consumers (`VehicleSidebarFilters.tsx`, `VehicleFilters.tsx`, `BrandModelFilter.tsx`) import without extension, and with `.tsx` removed, Vite will resolve to `.ts`. No import changes needed.

**B6** — In `src/routes/AppRoutes.tsx` line 6, change:
```
import AdminLayout from "@/components/layouts/AdminLayout";
```
to:
```
import AdminLayout from "@/components/layout/AdminLayout";
```
Then delete `src/components/layouts/AdminLayout.tsx`. Note: the `layout/` version uses `children` prop while `layouts/` uses `<Outlet />`. Since AppRoutes uses it as a route element wrapper (needs `<Outlet />`), I will keep the `<Outlet />` pattern in the surviving file by updating `src/components/layout/AdminLayout.tsx` to also support `<Outlet />`.

**B7** — Delete `src/components/debug/ImageDiagnostic.tsx`.

**B8** — In `src/pages/VehicleManagement.tsx`, wrap the debug `TabsContent` (lines 108-118) with `process.env.NODE_ENV === 'development'` conditional, and similarly guard the debug tab trigger.

**B9** — Remove `react-toastify` from `package.json`. No code references exist.

**B10** — Add `// DISABLED - feature pendiente de activación` as line 1 of both `src/services/disputeService.ts` and `src/services/disputeNotificationService.ts`.

### Risk: B6 AdminLayout pattern mismatch

The file kept (`layout/AdminLayout.tsx`) uses `children` prop, but `AppRoutes.tsx` uses it as a `<Route element={<AdminLayout />}>` with nested `<Route>` children — this requires `<Outlet />`. I will update `layout/AdminLayout.tsx` to use `<Outlet />` instead of `children`, matching the deleted file's pattern. This is not a logic change — it's fixing the surviving file to work correctly with React Router.

