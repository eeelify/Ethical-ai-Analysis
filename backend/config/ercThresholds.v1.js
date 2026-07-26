/**
 * ERC (Ethical Risk Contribution) Threshold Configuration - Version 1
 * 
 * VERSIONED for audit trail and methodology evolution.
 * 
 * ERC Formula: importance (0-4) × severity (0-1) = risk (0-4)
 * 
 * This version uses a 0-4 scale normalized thresholds.
 * If methodology changes, create ercThresholds.v2.js and update CURRENT_VERSION.
 */

module.exports = {
    version: 'erc-v1',
    description: 'Ethical AI Analysis ERC Thresholds - January 2026',

    scale: {
        min: 0,
        max: 4,
        unit: 'ERC (Importance × Severity)'
    },

    /**
     * Thresholds for NORMALIZED ERC values (averages, not cumulative sums)
     * 
     * Applied to:
     * - Average ERC per question
     * - Average ERC per principle
     * - Overall average ERC
     * 
     * NEVER applied to cumulative sums!
     */
    thresholds: {
        MINIMAL: { min: 0.0, max: 1.0, label: 'Minimal Risk', color: '#4CAF50' },
        LIMITED: { min: 1.0, max: 2.0, label: 'Limited Risk', color: '#edbf4bff' },
        HIGH: { min: 2.0, max: 3.0, label: 'High Risk', color: '#EF6C00' },
        UNACCEPTABLE: { min: 3.0, max: 4.0, label: 'Unacceptable Risk', color: '#D32F2F' }
    },

    /**
     * Get risk level from normalized ERC value
     */
    getRiskLevel(ercValue) {
        if (ercValue === null || ercValue === undefined || isNaN(ercValue)) {
            return { level: 'UNKNOWN', label: 'Data Unavailable', color: '#9E9E9E' };
        }

        const value = Number(ercValue);
        const thresholds = module.exports.thresholds;

        if (value >= 3.0) return { level: 'UNACCEPTABLE', ...thresholds.UNACCEPTABLE };
        if (value >= 2.0) return { level: 'HIGH', ...thresholds.HIGH };
        if (value >= 1.0) return { level: 'LIMITED', ...thresholds.LIMITED };
        return { level: 'MINIMAL', ...thresholds.MINIMAL };
    }
};
