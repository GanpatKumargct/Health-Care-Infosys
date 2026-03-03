import React, { useState } from 'react';
import { logActivity } from '../services/api';
import { Activity, Utensils, Moon, Droplets, Plus, Clock, Flame } from 'lucide-react';

const HealthLogger = ({ onActivityLogged }) => {
    const [activeTab, setActiveTab] = useState('WORKOUT');
    const [formData, setFormData] = useState({
        subType: '',
        value: '',
        secondaryValue: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFormData({ subType: '', value: '', secondaryValue: '', notes: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                type: activeTab,
                subType: formData.subType,
                value: parseFloat(formData.value) || 0,
                secondaryValue: formData.secondaryValue ? parseFloat(formData.secondaryValue) : null,
                notes: formData.notes
            };

            await logActivity(data);
            setFormData({ subType: '', value: '', secondaryValue: '', notes: '' });
            if (onActivityLogged) onActivityLogged();
        } catch (err) {
            console.error('Logging failed', err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'WORKOUT', label: 'Workout', icon: <Activity size={18} />, color: '#3b82f6' },
        { id: 'MEAL', label: 'Meal', icon: <Utensils size={18} />, color: '#ef4444' },
        { id: 'SLEEP', label: 'Sleep', icon: <Moon size={18} />, color: '#8b5cf6' },
        { id: 'WATER', label: 'Water', icon: <Droplets size={18} />, color: '#0ea5e9' }
    ];

    return (
        <div className="health-logger" style={{
            background: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} color="var(--primary)" />
                Quick Log
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid',
                            borderColor: activeTab === tab.id ? tab.color : 'var(--border)',
                            background: activeTab === tab.id ? `${tab.color}10` : 'transparent',
                            color: activeTab === tab.id ? tab.color : 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                            fontWeight: activeTab === tab.id ? '600' : '400'
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'WORKOUT' || activeTab === 'MEAL' ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                    {activeTab === 'WORKOUT' && (
                        <>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Workout Type</label>
                                <input
                                    type="text"
                                    name="subType"
                                    placeholder="e.g. Running"
                                    value={formData.subType}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Duration (min)</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        name="value"
                                        placeholder="30"
                                        value={formData.value}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                                    />
                                    <Clock size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calories Burned</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        name="secondaryValue"
                                        placeholder="e.g. 200"
                                        value={formData.secondaryValue}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                                    />
                                    <Flame size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#f97316' }} />
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'MEAL' && (
                        <>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Meal Type</label>
                                <select
                                    name="subType"
                                    value={formData.subType}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                                >
                                    <option value="">Select...</option>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Snack">Snack</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calories</label>
                                <input
                                    type="number"
                                    name="value"
                                    placeholder="500"
                                    value={formData.value}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Macros / Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    placeholder="e.g. Protein: 30g, Carbs: 50g"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', resize: 'none' }}
                                    rows="2"
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'SLEEP' && (
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sleep Duration (hours)</label>
                            <input
                                type="number"
                                name="value"
                                placeholder="8"
                                step="0.5"
                                value={formData.value}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                    )}

                    {activeTab === 'WATER' && (
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Water Intake (ml)</label>
                            <input
                                type="number"
                                name="value"
                                placeholder="250"
                                step="50"
                                value={formData.value}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: tabs.find(t => t.id === activeTab).color,
                        borderColor: tabs.find(t => t.id === activeTab).color
                    }}
                >
                    {loading ? 'Logging...' : `Log ${tabs.find(t => t.id === activeTab).label}`}
                </button>
            </form>
        </div>
    );
};

export default HealthLogger;
