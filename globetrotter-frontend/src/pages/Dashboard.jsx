import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsAPI } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTrips();
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const loadTrips = async () => {
    try {
      const response = await tripsAPI.getAll();
      setTrips(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this trip?')) return;
    try {
      await tripsAPI.delete(id);
      loadTrips();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTripDuration = (start, end) => {
    const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredTrips = trips.filter(trip => 
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (trip.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '4px solid rgba(255,255,255,0.3)', 
            borderTop: '4px solid white', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>Loading your adventures...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff, #fae8ff)' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ 
        background: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 10 
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(102,126,234,0.4)'
            }}>
              <span style={{ fontSize: '24px' }}>🌍</span>
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '5px 0 0 0' }}>Ready for your next adventure?</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/profile')}
              style={{ 
                padding: '12px 20px', 
                background: '#f3f4f6', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
            >
              👤 Profile
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
              style={{ 
                padding: '12px 20px', 
                background: '#fef2f2', 
                color: '#dc2626', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
              onMouseLeave={(e) => e.target.style.background = '#fef2f2'}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {trips.length > 0 && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '30px 20px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', background: '#dbeafe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '20px' }}>🗺️</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#3b82f6', background: '#dbeafe', padding: '4px 8px', borderRadius: '8px' }}>TOTAL</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{trips.length}</div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>Trip{trips.length !== 1 ? 's' : ''} Planned</div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', background: '#e9d5ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '20px' }}>📍</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#a855f7', background: '#e9d5ff', padding: '4px 8px', borderRadius: '8px' }}>PLACES</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
                {trips.reduce((sum, t) => sum + (t.stop_count || 0), 0)}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>Destinations</div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', background: '#d1fae5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '20px' }}>📅</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#10b981', background: '#d1fae5', padding: '4px 8px', borderRadius: '8px' }}>UPCOMING</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
                {trips.filter(t => new Date(t.start_date) > new Date()).length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>Active Trips</div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', background: '#fef3c7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '20px' }}>💰</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#f59e0b', background: '#fef3c7', padding: '4px 8px', borderRadius: '8px' }}>BUDGET</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
                ${trips.reduce((sum, t) => sum + (t.total_budget || 0), 0).toFixed(0)}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>Total Planned</div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Search Bar */}
        {trips.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <input
              type="text"
              placeholder="🔍 Search your trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: '16px 24px',
                fontSize: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
                background: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 4px 12px rgba(102,126,234,0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>Your Trips</h2>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: '8px 0 0 0' }}>
              {trips.length === 0 ? 'No trips yet' : `Managing ${trips.length} trip${trips.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => navigate('/create-trip')}
            style={{ 
              padding: '16px 32px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '14px', 
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(102,126,234,0.4)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 28px rgba(102,126,234,0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 20px rgba(102,126,234,0.4)';
            }}
          >
            ✨ Create New Trip
          </button>
        </div>

        {filteredTrips.length === 0 && searchQuery ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '24px', 
            padding: '60px 40px', 
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#1f2937' }}>
              No trips found
            </h3>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
              Try searching with different keywords
            </p>
            <button
              onClick={() => setSearchQuery('')}
              style={{ 
                marginTop: '20px',
                padding: '12px 24px', 
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear Search
            </button>
          </div>
        ) : trips.length === 0 ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '24px', 
            padding: '80px 40px', 
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              background: 'linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 30px',
              fontSize: '48px'
            }}>
              🗺️
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
              Your Journey Starts Here
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '40px', fontSize: '18px', maxWidth: '500px', margin: '0 auto 40px', lineHeight: '1.6' }}>
              Create your first trip and discover amazing destinations. Plan every detail and make memories that last forever.
            </p>
            <button
              onClick={() => navigate('/create-trip')}
              style={{ 
                padding: '18px 40px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '14px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(102,126,234,0.4)',
                transition: 'all 0.3s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 15px 35px rgba(102,126,234,0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 10px 25px rgba(102,126,234,0.4)';
              }}
            >
              <span style={{ fontSize: '24px' }}>✈️</span>
              Plan Your First Trip
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {filteredTrips.map((trip, index) => {
              const duration = getTripDuration(trip.start_date, trip.end_date);
              const isUpcoming = new Date(trip.start_date) > new Date();
              const gradients = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
              ];

              return (
                <div
                  key={trip.id}
                  style={{ 
                    background: 'white', 
                    borderRadius: '20px', 
                    overflow: 'hidden', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: '1px solid rgba(0,0,0,0.05)',
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{ 
                    height: '180px', 
                    background: gradients[index % gradients.length],
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '25px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: isUpcoming ? '#10b981' : '#6b7280',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {isUpcoming ? '🚀 Upcoming' : '✅ Past'}
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)'
                    }}></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h3 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0, lineHeight: '1.3', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                        {trip.name}
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '14px', margin: '8px 0 0', fontWeight: '600' }}>
                        {duration} day{duration !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ padding: '24px' }}>
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: '14px', 
                      marginBottom: '20px', 
                      minHeight: '40px',
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {trip.description || 'No description provided'}
                    </p>
                    
                    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          background: '#dbeafe', 
                          borderRadius: '10px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <span>📅</span>
                        </div>
                        <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          background: '#e9d5ff', 
                          borderRadius: '10px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <span>📍</span>
                        </div>
                        <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                          {trip.stop_count || 0} destination{(trip.stop_count || 0) !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {trip.total_budget > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '36px', 
                            height: '36px', 
                            background: '#d1fae5', 
                            borderRadius: '10px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <span>💰</span>
                          </div>
                          <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                            ${trip.total_budget.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trips/${trip.id}`);
                        }}
                        style={{ 
                          flex: 1, 
                          padding: '12px', 
                          background: '#eff6ff', 
                          color: '#2563eb', 
                          border: 'none', 
                          borderRadius: '12px',
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#dbeafe'}
                        onMouseLeave={(e) => e.target.style.background = '#eff6ff'}
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => handleDelete(trip.id, e)}
                        style={{ 
                          padding: '12px 16px', 
                          background: '#fef2f2', 
                          border: 'none', 
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '18px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
                        onMouseLeave={(e) => e.target.style.background = '#fef2f2'}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
