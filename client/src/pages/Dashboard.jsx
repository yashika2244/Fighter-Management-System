export default function Dashboard(){
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-6 rounded bg-gray-100">Total Users</div>
        <div className="p-6 rounded bg-gray-100">On Duty Today</div>
        <div className="p-6 rounded bg-gray-100">On Leave</div>
      </div>
    </div>
  );
}
