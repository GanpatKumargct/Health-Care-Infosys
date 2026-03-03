import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivities } from '../services/api';
import HealthLogger from './HealthLogger';
import { Activity, Utensils, Moon, Droplets, Calendar } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('');
    const [completion, setCompletion] = useState(0);
    const [activities, setActivities] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const fetchActivities = async () => {
        setLoadingLogs(true);
        try {
            const response = await getActivities();
            // Sort by timestamp descending
            const sorted = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setActivities(sorted);
        } catch (err) {
            console.error('Failed to fetch activities', err);
        } finally {
            setLoadingLogs(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const savedCompletion = localStorage.getItem('profileCompletion');

        if (!token) {
            navigate('/login');
        } else {
            setUserRole(role);
            if (savedCompletion) setCompletion(parseInt(savedCompletion));
            if (role === 'PATIENT') fetchActivities();
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'WORKOUT': return <Activity size={18} color="#3b82f6" />;
            case 'MEAL': return <Utensils size={18} color="#ef4444" />;
            case 'SLEEP': return <Moon size={18} color="#8b5cf6" />;
            case 'WATER': return <Droplets size={18} color="#0ea5e9" />;
            default: return <Activity size={18} />;
        }
    };

    const formatTimestamp = (ts) => {
        const date = new Date(ts);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)' }}>WellNest Dashboard</h1>
                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </header>

            <div className="card">
                <h2>Welcome, {userRole}!</h2>

                {userRole === 'PATIENT' && (
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="left-column">
                                <div style={{
                                    background: 'var(--bg-alt)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '2rem',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ marginBottom: '0.25rem' }}>Profile Completion</h3>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                {completion === 100 ? 'Your profile is fully optimized!' : 'Complete your profile to get better insights.'}
                                            </p>
                                        </div>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{completion}%</span>
                                    </div>
                                    <div style={{ height: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${completion}%`,
                                            background: 'var(--primary)',
                                            transition: 'width 0.5s ease-out'
                                        }}></div>
                                    </div>
                                    {completion < 100 && (
                                        <button
                                            onClick={() => navigate('/profile-setup')}
                                            className="btn btn-primary"
                                            style={{ width: '100%', marginTop: '0.5rem' }}
                                        >
                                            Complete Your Profile
                                        </button>
                                    )}
                                </div>

                                <HealthLogger onActivityLogged={fetchActivities} />
                            </div>

                            <div className="right-column">
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={20} color="var(--primary)" />
                                    Today's Activity
                                </h3>

                                {loadingLogs ? (
                                    <p>Loading activities...</p>
                                ) : activities.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                                        <p style={{ color: 'var(--text-muted)' }}>No activities logged for today.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {activities.slice(0, 5).map((act) => (
                                            <div key={act.id} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: '1rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--border)'
                                            }}>
                                                <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--bg-alt)' }}>
                                                    {getActivityIcon(act.type)}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: '600' }}>{act.subType || act.type}</span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatTimestamp(act.timestamp)}</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                        {act.type === 'WORKOUT' && `${act.value} min • ${act.secondaryValue} kcal`}
                                                        {act.type === 'MEAL' && `${act.value} kcal`}
                                                        {act.type === 'SLEEP' && `${act.value} hours`}
                                                        {act.type === 'WATER' && `${act.value} ml`}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {activities.length > 5 && (
                                            <button className="btn btn-text" style={{ alignSelf: 'center', fontSize: '0.85rem' }}>View All</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {userRole === 'DOCTOR' && (
                    <div style={{ marginTop: '2rem' }}>
                        {/* Doctor specific content placeholder */}
                        <h3>My Patients</h3>
                        <p>No patients assigned yet.</p>
                    </div>
                )}

                {userRole === 'RECEPTIONIST' && (
                    <div style={{ marginTop: '2rem' }}>
                        {/* Receptionist specific content placeholder */}
                        <h3>Schedule Appointments</h3>
                        <p>Calendar view loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
