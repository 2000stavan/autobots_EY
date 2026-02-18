import { useState, useEffect } from 'react';

export interface VehicleData {
    vehicle_id: string;
    timestamp: string;
    speed_mph: number;
    engine_rpm: number;
    engine_load_pct: number;
    coolant_temp_f: number;
    fuel_level_pct: number;
    battery_voltage: number;
    latitude: number;
    longitude: number;
    odometer_miles: number;
    trouble_codes: string;
}

export const useVehicleData = (targetVehicleId: string) => {
    const [data, setData] = useState<VehicleData | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Simulation state
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/telematics_snapshot.csv');
                const text = await response.text();

                // Simple CSV parser
                const lines = text.trim().split('\n');
                const headers = lines[0].split(',');

                const vehicles: VehicleData[] = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const entry: any = {};
                    headers.forEach((header, index) => {
                        const value = values[index];
                        // Attempt to parse numbers
                        if (!isNaN(Number(value)) && value.trim() !== '') {
                            entry[header.trim()] = Number(value);
                        } else {
                            entry[header.trim()] = value;
                        }
                    });
                    return entry as VehicleData;
                });

                const targetVehicle = vehicles.find(v => v.vehicle_id === targetVehicleId);

                if (targetVehicle) {
                    setData(targetVehicle);
                } else {
                    setError(`Vehicle ${targetVehicleId} not found in data.`);
                }
            } catch (err) {
                setError('Failed to load vehicle data.');
                console.error(err);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [targetVehicleId]);

    // Simulation Trigger
    const simulateError = (code: string) => {
        if (data) {
            setIsSimulating(true);
            setData(prev => prev ? ({ ...prev, trouble_codes: code }) : null);
        }
    };

    const clearError = () => {
        if (data) {
            setIsSimulating(false);
            setData(prev => prev ? ({ ...prev, trouble_codes: '' }) : null);
        }
    };

    return {
        data,
        loading: initialLoading,
        error,
        isSimulating,
        simulateError,
        clearError
    };
};
