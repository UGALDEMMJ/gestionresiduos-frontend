import React from 'react'

const BotonAuth = ({ onClick, icon: Icon, label }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center w-full h-10 px-4 py-2 mb-2 space-x-2 text-sm font-medium text-black  bg-yellow-400 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 text"
            aria-label={label}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </button>
    );
}

export default BotonAuth