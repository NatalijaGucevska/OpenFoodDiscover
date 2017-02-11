import React from 'react';

export function StartTry({router}) {
  setTimeout(function() { router.push("/Home"); }, 4000);
    return (
        <h1 className="vhcenter">Today<br/> let's try</h1>
    );
}
