import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  LayoutDashboard,
  Settings,
  History,
  MapPin,
  Wrench,
  Sparkles,
  Mic,
  X,
  User,
  AlertTriangle
} from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { Gauge } from './components/Gauge';
import { DigitalTwin } from './components/DigitalTwin';
import { AlertLog } from './components/AlertLog';
import { Waveform } from './components/Waveform';
import { NavTab, Alert } from './types';
import { useVehicleData } from './hooks/useVehicleData';

const BASE_ALERTS: Alert[] = [
  {
    id: '2',
    code: 'SYS-OK',
    time: '10:15 AM',
    message: 'Brake Fluid Pressure Nominal',
    severity: 'info',
    active: false
  },
  {
    id: '3',
    code: 'SYS-OK',
    time: '08:30 AM',
    message: 'Tire Pressure Check: 32 PSI (All)',
    severity: 'info',
    active: false
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('Dashboard');
  const [showAssistant, setShowAssistant] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(BASE_ALERTS);
  const [isCallActive, setIsCallActive] = useState(false);
  const [maintenanceHistory, setMaintenanceHistory] = useState<any[]>([]); // simplified for demo

  // Vapi Instance
  const vapiRef = useRef<any>(null);

  // Vehicle Data Hook
  const { data, loading, simulateError, clearError, isSimulating } = useVehicleData('V-101');

  // Derived State
  const hasTroubleCode = !!data?.trouble_codes;
  const isHealthy = !hasTroubleCode;

  // Initialize Vapi
  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      console.error("VITE_VAPI_PUBLIC_KEY is missing!");
      alert("VITE_VAPI_PUBLIC_KEY is missing in environment variables!");
    }

    const vapi = new Vapi(publicKey || '');
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      console.log('Call started');
      setIsCallActive(true);
      setShowAssistant(true);
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      setIsCallActive(false);
      setShowAssistant(false);
    });

    vapi.on('error', (e) => {
      console.error('Vapi Error:', e);
      // alert('Vapi Error: ' + JSON.stringify(e)); // Optional: alert on error
    });

    vapi.on('speech-start', () => console.log('Speech started'));
    vapi.on('speech-end', () => console.log('Speech ended'));
    vapi.on('volume-level', (vol) => {
      if (vol > 0.05) console.log('Volume:', vol);
    });

    // Log messages from assistant
    vapi.on('message', (message) => {
      console.log('Vapi Message:', message);
    });

    return () => {
      try {
        vapi.stop();
      } catch (e) {
        console.error('Error stopping Vapi:', e);
      }
    };
  }, []);

  // React to Trouble Codes - Simulator Loop
  useEffect(() => {
    if (data?.trouble_codes) {
      // 1. Update Alert Log
      const newAlert: Alert = {
        id: Date.now().toString(),
        code: data.trouble_codes,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: data.trouble_codes === 'P0300' ? 'Random/Multiple Cylinder Misfire Detected' : `Trouble Code ${data.trouble_codes} Detected`,
        severity: 'critical',
        active: true
      };

      setAlerts(prev => {
        if (prev.some(a => a.code === newAlert.code && a.active)) return prev;
        return [newAlert, ...prev];
      });

      // 2. Trigger Voice Assistant (Only if simulating)
      if (isSimulating) {
        setShowAssistant(true); // Force show UI immediately
        if (vapiRef.current) {
          try {
            vapiRef.current.start(import.meta.env.VITE_VAPI_ASSISTANT_ID, {
              vehicle_id: data.vehicle_id,
              trouble_code: data.trouble_codes
            });
          } catch (e) {
            console.error('Error starting Vapi:', e);
          }
        }
      }
    }
  }, [data?.trouble_codes, isSimulating, data?.vehicle_id]);

  const handleRepair = () => {
    // 1. Voice Feedback
    if (vapiRef.current) {
      vapiRef.current.say("Repair initiated. Closing diagnostic link now.", true);

      // Wait briefly for the speech to start before stopping (optional, but vapi.say with End Call usually handles it)
      // However, vapi.say with `true` (endCallAfterSpoken) will stop the call automatically.
      // We'll trust the sdk to handle the stop.
    }

    // 2. Add to Maintenance History
    const newRecord = {
      id: Date.now(),
      vehicleId: data?.vehicle_id,
      service: 'Misfire Diagnosis & Coil Replacement',
      status: 'Completed',
      date: "2026-02-12"
    };
    setMaintenanceHistory(prev => [newRecord, ...prev]);

    // 3. Reset System State
    // clearError function from hook
    clearError();
    setIsCallActive(false);
    setShowAssistant(false);

    // 4. Switch to History Tab
    setTimeout(() => {
      setActiveTab('History');
    }, 1500); // Small delay to let the user see the "Repair" action effect if needed, or just transition.
  };

  return (
    <div className="bg-background-dark text-white overflow-hidden h-screen flex flex-col font-display selection:bg-primary/30">

      {/* Top Navigation */}
      <header className="flex items-center justify-between px-10 py-4 glass-panel border-b border-white/5 z-50 h-20 shrink-0">
        <div className="flex items-center gap-12">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg shadow-lg transition-colors ${isHealthy ? 'bg-primary shadow-primary/20' : 'bg-red-500 shadow-red-500/20'}`}>
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Autobots EY</h1>
          </div>

          {/* Unit Status Pill */}
          <div className={`flex items-center gap-4 rounded-full px-4 py-1.5 border transition-colors duration-500 ${isHealthy
            ? 'bg-white/5 border-white/10'
            : 'bg-red-500/10 border-red-500/30'
            }`}>
            <span className="text-sm font-medium text-white/60">Unit:</span>
            <span className="text-sm font-bold text-white max-w-[100px] truncate">{data?.vehicle_id || 'Connecting...'}</span>
            <div className="h-3 w-[1px] bg-white/20 mx-1"></div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse ${isHealthy ? 'bg-emerald-500 shadow-emerald-500' : 'bg-red-500 shadow-red-500'
                }`}></div>
              <span className={`text-xs font-bold uppercase tracking-wider ${isHealthy ? 'text-emerald-500' : 'text-red-500'
                }`}>
                {loading ? 'SYNCING...' : isHealthy ? 'HEALTHY' : 'CRITICAL'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Main Nav */}
          <nav className="flex items-center gap-8">
            {(['Dashboard', 'Diagnostics', 'Service', 'History'] as NavTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium transition-all duration-200 ${activeTab === tab
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-white/60 hover:text-white pb-1 border-b-2 border-transparent'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* User/Notifs */}
          <div className="flex items-center gap-3 ml-4">


            <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors relative group">
              <Bell className="w-5 h-5 text-white/80 group-hover:text-white" />
              {hasTroubleCode && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#080c10] animate-ping"></span>
              )}
            </button>
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtLiwD3MqVnT2kWYQnnt-iLVlhalI2gf1aR7mrjkt6UXUjqgqhI4G1WBq-pCxR6lPGYErUvrdK05kPFB_7Hs-lxKo2Le2Y7-IvpkKiuu0V3H-BDslUTNTIIqlJ59ntxNuU2Y0ZEG5VqfkMP7YXJ27J5szqg9sQTXBZY4RbTTN92xkJmUe0fbRY0ARr8rZcK8wndXexXlPhuRc5iKaaZzH2YaNbKUfrbML1sfxhILFs02UTcFEf6UfoXDQ0C6xJbI5Jh7KRC7oamLjT"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex-1 flex overflow-hidden">

        {/* Left Sidebar: Controls */}
        <aside className="w-20 glass-panel border-r border-white/5 flex flex-col items-center py-8 gap-8 z-40 shrink-0">
          <div className="flex flex-col gap-6">
            <button className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              <LayoutDashboard className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 rounded-xl bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all group">
              <Wrench className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
            <button className="w-12 h-12 rounded-xl bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
              <History className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 rounded-xl bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
              <MapPin className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-auto flex flex-col gap-6">
            <button className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${hasTroubleCode
              ? 'bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
              : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
              }`}>
              <AlertTriangle className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 rounded-xl bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all hover:rotate-90">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </aside>

        {/* Center Main Content Area - Conditional Rendering */}
        {activeTab === 'Dashboard' ? (
          <section className="flex-1 relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(13,127,242,0.08)_0%,_transparent_70%)] overflow-hidden">

            {/* 3D Visualization */}
            <div className="flex-1 w-full flex items-center justify-center p-10 relative flex-col">
              <DigitalTwin />

              {/* Central Voice Assistant Trigger */}
              {!showAssistant && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
                  <button
                    onClick={() => {
                      console.log("Central button clicked. Starting Vapi...");
                      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
                      if (!assistantId) {
                        alert("Missing Assistant ID! Check .env.local");
                        return;
                      }
                      vapiRef.current?.start(assistantId)
                        .then(() => console.log("Vapi start request sent"))
                        .catch((e: any) => alert("Failed to start: " + e.message));
                    }}
                    className="group relative flex items-center gap-3 px-8 py-4 bg-primary/20 hover:bg-primary/30 backdrop-blur-md border border-primary/50 rounded-full shadow-[0_0_30px_rgba(13,127,242,0.3)] transition-all hover:scale-105 active:scale-95"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full animate-pulse"></div>
                      <Mic className="w-8 h-8 text-white relative z-10" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-wide">START VOICE ASSISTANT</span>
                  </button>
                  <p className="text-xs text-white/40 font-mono">
                    Status: {vapiRef.current ? "Ready" : "Initializing..."}
                  </p>
                </div>
              )}

              {/* Hidden Simulation Trigger (Bottom Right of Stage) */}
              <button
                onClick={() => simulateError('P0300')}
                className="absolute bottom-4 right-4 text-xs font-mono text-white/20 hover:text-red-500 hover:bg-red-500/10 px-2 py-1 rounded border border-transparent hover:border-red-500/20 transition-all opacity-20 hover:opacity-100 z-50 cursor-pointer"
              >
                [SIMULATE P0300]
              </button>
            </div>

            {/* Bottom Gauges */}
            <div className="h-48 w-full flex items-start justify-center gap-16 pb-12 z-10 transition-opacity duration-500">
              <Gauge
                value={data?.speed_mph || 0}
                max={120}
                label="Speed"
                unit="MPH"
              />
              <Gauge
                value={data?.fuel_level_pct || 0}
                max={100}
                label="Fuel"
                unit="FUEL %"
                formatValue={(v) => Math.round(v).toString()}
              />
              <Gauge
                value={data?.battery_voltage || 0}
                max={16}
                label="Battery"
                unit="VOLTS"
                color={data && data.battery_voltage < 12 ? "#ef4444" : "#0d7ff2"}
              />
            </div>

            {/* Floating Assistant Bar (Active State) */}
            {showAssistant && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-panel w-full max-w-2xl p-8 rounded-3xl border border-primary/30 shadow-[0_0_50px_rgba(13,127,242,0.2)] flex flex-col items-center gap-6 z-50 animate-in zoom-in-95 duration-300 bg-black/80 backdrop-blur-xl">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_20px_rgba(13,127,242,0.4)]">
                  <Mic className="text-primary w-10 h-10 animate-pulse" />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-bold tracking-tight text-white">
                    {isCallActive ? 'Shreya is Listening...' : 'Connecting...'}
                  </span>
                  <p className="text-white/40 text-sm">Speak clearly to the assistant</p>
                </div>

                <div className="w-full max-w-md h-12 flex items-center justify-center">
                  <Waveform active={isCallActive} />
                </div>

                <div className="flex gap-4 mt-4">
                  {hasTroubleCode && (
                    <button
                      onClick={handleRepair}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <Wrench className="w-4 h-4" />
                      SCHEDULE REPAIR
                    </button>
                  )}
                  <button
                    onClick={() => {
                      vapiRef.current?.stop();
                      setShowAssistant(false);
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-full border border-white/10 transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </section>
        ) : activeTab === 'History' ? (
          <div className="flex-1 w-full p-10 flex flex-col items-center overflow-auto bg-[radial-gradient(circle_at_center,_rgba(13,127,242,0.05)_0%,_transparent_70%)]">
            <div className="w-full max-w-4xl glass-panel p-6 rounded-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <History className="w-6 h-6 text-primary" />
                  Maintenance History
                </h2>
                <div className="text-sm text-white/40">Vehicle ID: {data?.vehicle_id}</div>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 font-medium text-white/60 text-sm uppercase tracking-wider pl-4">Date</th>
                    <th className="py-4 font-medium text-white/60 text-sm uppercase tracking-wider">Service</th>
                    <th className="py-4 font-medium text-white/60 text-sm uppercase tracking-wider">Status</th>
                    <th className="py-4 font-medium text-white/60 text-sm uppercase tracking-wider pr-4">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceHistory.length > 0 ? (
                    maintenanceHistory.map((record) => (
                      <tr key={record.id} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                        <td className="py-4 text-white/80 font-mono text-sm pl-4">{record.date}</td>
                        <td className="py-4 text-white font-medium">{record.service}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            {record.status}
                          </span>
                        </td>
                        <td className="py-4 text-white/40 text-xs font-mono pr-4">#{record.id}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-white/30 italic">
                        No recent maintenance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/30 italic">
            Module under development
          </div>
        )}

        {/* Right Sidebar: Alert Log - Conditionally Rendered */}
        {hasTroubleCode && <AlertLog alerts={alerts} />}
      </main>
    </div>
  );
};

export default App;