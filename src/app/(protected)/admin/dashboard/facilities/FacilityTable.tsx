
"use client";
import React from "react";

const FacilityTable = () => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    Facility Management
                </h2>
                <button className="bg-[var(--primary)] text-white px-3 py-2 rounded-md hover:bg-[var(--dark)] transition">
                    + Add Facility
                </button>
            </div>

            <p className="text-[var(--text-secondary)] italic">
                Coming soon — manage facilities and room specialties.
            </p>
        </div>
    );
};

export default FacilityTable;
