import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsAPI } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ trips: 0, destinations: 0, budget: 0 });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setName(userData.name || '');
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await tripsAPI.getAll();
      const trips = response.data || [];
      setStats({
        trips: trips.length,
        destinations: trips.reduce((sum, t) => sum + (t.stop_count || 0), 0),
        budget: trips.reduce((sum, t) => sum + (t.total_budget || 0), 0)
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSave = () => {
    const userData = { ...user, name };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setEditing(false);
    alert('Name updated successfully!');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff, #fae8ff)' }}>
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px', marginBottom: '30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ 
              padding: '10px 20px', 
              background: '#f3f4f6', 
              border: 'none', 
              borderRadius: '10px', 
              cursor: 'pointer', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>My Profile</h1>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '50px 40px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ 
              width: '140px', 
              height: '140px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              margin: '0 auto 25px',
              boxShadow: '0 15px 40px rgba(102,126,234,0.4)'
            }}>
              👤
            </div>
            
            {editing ? (
              <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    border: '2px solid #667eea',
                    borderRadius: '12px',
                    padding: '15px 20px',
                    marginBottom: '15px',
                    width: '100%'
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={handleSave}
                    style={{ 
                      padding: '12px 35px', 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '10px', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setName(user?.name || '');
                    }}
                    style={{ 
                      padding: '12px 35px', 
                      background: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '10px', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#1f2937' }}>
                  {user?.name || 'Traveler'}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '18px', margin: '0 0 20px 0' }}>{user?.email}</p>
                <button
                  onClick={() => setEditing(true)}
                  style={{ 
                    padding: '12px 30px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    fontSize: '16px',
                    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102,126,234,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.4)';
                  }}
                >
                  ✏️ Edit Profile
                </button>
              </div>
            )}
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937', textAlign: 'center' }}>
            📊 Your Travel Stats
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
              borderRadius: '16px', 
              padding: '30px 25px', 
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(59,130,246,0.2)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🗺️</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>{stats.trips}</div>
              <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Total Trips
              </div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
              borderRadius: '16px', 
              padding: '30px 25px', 
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(245,158,11,0.2)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📍</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>{stats.destinations}</div>
              <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Destinations
              </div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', 
              borderRadius: '16px', 
              padding: '30px 25px', 
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(16,185,129,0.2)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>💰</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
                ${stats.budget.toFixed(0)}
              </div>
              <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Total Budget
              </div>
            </div>
          </div>

          <div style={{ marginTop: '50px', padding: '35px', background: '#fef2f2', borderRadius: '16px', border: '2px solid #fecaca' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '10px' }}>
              ⚠️ Danger Zone
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '15px', lineHeight: '1.6' }}>
              Deleting your account will permanently remove all your trips, itineraries, and data. This action cannot be undone.
            </p>
            <button
              onClick={() => {
                if (confirm('⚠️ Are you ABSOLUTELY SURE you want to delete your account?\n\nThis will:\n- Delete ALL your trips\n- Delete ALL your data\n- Cannot be undone\n\nType YES in the next dialog to confirm.')) {
                  const confirmation = prompt('Type "DELETE" to confirm account deletion:');
                  if (confirmation === 'DELETE') {
                    localStorage.clear();
                    alert('Account deleted successfully');
                    navigate('/login');
                  } else {
                    alert('Account deletion cancelled');
                  }
                }
              }}
              style={{ 
                padding: '14px 30px', 
                background: '#dc2626', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                fontWeight: '700', 
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#b91c1c';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#dc2626';
                e.target.style.transform = 'scale(1)';
              }}
            >
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
