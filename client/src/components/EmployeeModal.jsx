import { useEffect, useState } from 'react';
import { X, User, Calendar, FileText, CreditCard, Edit, Save } from 'lucide-react';
import { api } from '../lib/axios';

export default function EmployeeModal({ employee, isOpen, onClose, onSave }) {
  console.log('EmployeeModal props:', { employee, isOpen, onClose, onSave });
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(employee || {});
  
  // Leave state
  const [leaveForm, setLeaveForm] = useState({ from: '', to: '', type: 'EL', reason: '' });
  const [userLeaves, setUserLeaves] = useState([]);

  useEffect(() => {
    console.log('EmployeeModal useEffect triggered:', { isOpen, employeeId: employee?._id });
    if (isOpen && employee?._id) {
      api.get(`/leaves/${employee._id}`).then(res => setUserLeaves(res.data)).catch(()=>{});
    }
  }, [isOpen, employee]);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen || !employee) return null;

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'dates', label: 'Dates', icon: Calendar },
    { id: 'leave', label: 'Leaves', icon: FileText },
    { id: 'bank', label: 'Bank Details', icon: CreditCard },
  ];

  const renderPersonalTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SL NO</label>
        <input
          type="text"
          value={formData.slNo || ''}
          onChange={(e) => handleInputChange('slNo', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">FORCE NO</label>
        <input
          type="text"
          value={formData.forceNo || ''}
          onChange={(e) => handleInputChange('forceNo', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">RANK</label>
        <input
          type="text"
          value={formData.rank || ''}
          onChange={(e) => handleInputChange('rank', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">NAME</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">MOBILE NO</label>
        <input
          type="text"
          value={formData.mobileNo || ''}
          onChange={(e) => handleInputChange('mobileNo', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">STATE</label>
        <input
          type="text"
          value={formData.state || ''}
          onChange={(e) => handleInputChange('state', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">RELIGION</label>
        <input
          type="text"
          value={formData.religion || ''}
          onChange={(e) => handleInputChange('religion', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CASTE</label>
        <input
          type="text"
          value={formData.caste || ''}
          onChange={(e) => handleInputChange('caste', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">BLOOD GROUP</label>
        <input
          type="text"
          value={formData.bg || ''}
          onChange={(e) => handleInputChange('bg', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">HOME ADDRESS</label>
        <textarea
          value={formData.homeAddress || ''}
          onChange={(e) => handleInputChange('homeAddress', e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">HEIGHT</label>
        <input
          type="text"
          value={formData.height || ''}
          onChange={(e) => handleInputChange('height', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">DEPENDENT</label>
        <input
          type="text"
          value={formData.dependent || ''}
          onChange={(e) => handleInputChange('dependent', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">NOK (Next of Kin)</label>
        <input
          type="text"
          value={formData.nok || ''}
          onChange={(e) => handleInputChange('nok', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ICARD NO</label>
        <input
          type="text"
          value={formData.icardNo || ''}
          onChange={(e) => handleInputChange('icardNo', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
    </div>
  );

  const renderDatesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">DOA COY (Date of Arrival in Company)</label>
        <input
          type="date"
          value={formData.doaCoy || ''}
          onChange={(e) => handleInputChange('doaCoy', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">DOA UNIT (Date of Arrival in Unit)</label>
        <input
          type="date"
          value={formData.doaUnit || ''}
          onChange={(e) => handleInputChange('doaUnit', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">DOB (Date of Birth)</label>
        <input
          type="date"
          value={formData.dob || ''}
          onChange={(e) => handleInputChange('dob', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">DOE (Date of Exit/Engagement)</label>
        <input
          type="date"
          value={formData.doe || ''}
          onChange={(e) => handleInputChange('doe', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">DOP (Date of Promotion)</label>
        <input
          type="date"
          value={formData.dop || ''}
          onChange={(e) => handleInputChange('dop', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">JD PET 1ST (Joining Date 1st Period)</label>
        <input
          type="date"
          value={formData.jdPet1st || ''}
          onChange={(e) => handleInputChange('jdPet1st', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">JD PET 2ND (Joining Date 2nd Period)</label>
        <input
          type="date"
          value={formData.jdPet2nd || ''}
          onChange={(e) => handleInputChange('jdPet2nd', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
    </div>
  );

  const renderLeaveTab = () => (
    <div className="space-y-6">
      {/* Entitlements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>EL</span>
            <span>{formData.elUsed ?? 0}/{formData.elTotal ?? 60}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 bg-indigo-600" style={{ width: `${((formData.elUsed ?? 0)/(formData.elTotal ?? 60))*100}%` }}></div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>CL</span>
            <span>{formData.clUsed ?? 0}/{formData.clTotal ?? 15}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 bg-green-600" style={{ width: `${((formData.clUsed ?? 0)/(formData.clTotal ?? 15))*100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Add Leave Form */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">Add Leave</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="date" value={leaveForm.from} onChange={(e)=>setLeaveForm({...leaveForm, from: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm"/>
          <input type="date" value={leaveForm.to} onChange={(e)=>setLeaveForm({...leaveForm, to: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm"/>
          <select value={leaveForm.type} onChange={(e)=>setLeaveForm({...leaveForm, type: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="EL">EL</option>
            <option value="CL">CL</option>
          </select>
          <input type="text" placeholder="Reason" value={leaveForm.reason} onChange={(e)=>setLeaveForm({...leaveForm, reason: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm"/>
        </div>
        <div className="mt-3">
          <button
            onClick={async()=>{
              if(!leaveForm.from||!leaveForm.to) {
                alert('Please select both start and end dates');
                return;
              }
              
              const fromDate = new Date(leaveForm.from);
              const toDate = new Date(leaveForm.to);
              
              if (fromDate > toDate) {
                alert('Start date cannot be after end date');
                return;
              }
              
              try{
                console.log('Sending leave request:', { ...leaveForm, user: employee._id });
                const { data } = await api.post('/leaves',{...leaveForm,user: employee._id});
                console.log('Leave created successfully:', data);
                
                // Update local entitlements view optimistically
                if(leaveForm.type==='EL'){
                  setFormData(prev=>({...prev, elUsed: (prev.elUsed??0) + (data.leave?.noOfDays||1)}));
                } else {
                  setFormData(prev=>({...prev, clUsed: (prev.clUsed??0) + (data.leave?.noOfDays||1)}));
                }
                setUserLeaves(prev=>[...prev, data.leave]);
                setLeaveForm({ from:'', to:'', type:'EL', reason:'' });
              }catch(err){
                console.error('Leave creation error:', err);
                alert(err.response?.data?.message||'Failed to add leave');
              }
            }}
            className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm"
          >
            Add Leave
          </button>
        </div>
      </div>

      {/* Leaves List */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">Leaves</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userLeaves.length===0 ? (
                <tr><td colSpan="4" className="px-3 py-4 text-gray-500 text-center">No leaves</td></tr>
              ) : userLeaves.map((l)=> (
                <tr key={l._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{new Date(l.from).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{new Date(l.to).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{l.type}</td>
                  <td className="px-3 py-2">{l.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBankTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">BANK ACCT (Account Number)</label>
        <input
          type="text"
          value={formData.bankAcct || ''}
          onChange={(e) => handleInputChange('bankAcct', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">BR NAME (Branch Name)</label>
        <input
          type="text"
          value={formData.brName || ''}
          onChange={(e) => handleInputChange('brName', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC CODE</label>
        <input
          type="text"
          value={formData.ifscCode || ''}
          onChange={(e) => handleInputChange('ifscCode', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">MICR</label>
        <input
          type="text"
          value={formData.micr || ''}
          onChange={(e) => handleInputChange('micr', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100"
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalTab();
      case 'dates':
        return renderDatesTab();
      case 'leave':
        return renderLeaveTab();
      case 'bank':
        return renderBankTab();
      default:
        return renderPersonalTab();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {employee.name || 'Employee Details'}
            </h2>
            <p className="text-gray-600">Force No: {employee.forceNo}</p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
