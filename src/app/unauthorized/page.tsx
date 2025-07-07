// src/app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );
}
