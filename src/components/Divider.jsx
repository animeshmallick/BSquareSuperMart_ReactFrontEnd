import React from 'react';

const Divider = ({ color = 'bg-gray-300', height = 'h-px', margin = 'my-2' }) => {
    return (
        <div className={`${color} ${height} ${margin} w-full`} aria-hidden="true"></div>
    );
};

export default Divider;